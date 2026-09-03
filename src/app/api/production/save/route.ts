import {
  hasProductionEntries,
  parseProductionBatchInput,
  summarizeProduction,
} from "@/domain/production";
import { productTargetRef } from "@/domain/production-view";
import { markProductionVerified } from "@/domain/production-deadline";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import {
  assertSameOrigin,
  authorizeStudentWrite,
  ProductionHttpError,
  productionErrorResponse,
  requireProductionSession,
} from "@/server/production-access";
import { loadProductionConfig } from "@/server/production-context";
import { ensureLatestProductionAudit } from "@/server/production-audit";
import type { Json } from "@/types/database";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    const body = await request.json().catch(() => null);
    let input;
    try {
      input = parseProductionBatchInput(body);
    } catch (error) {
      throw new ProductionHttpError(
        error instanceof Error ? error.message : "Dados de producao invalidos.",
        400,
      );
    }

    const supabase = createSupabaseAdminClient();
    const student = await authorizeStudentWrite(supabase, session, input.studentId);
    const config = await loadProductionConfig(supabase);
    const productionAuditHistory = await ensureLatestProductionAudit(
      supabase,
      config,
    );

    if (input.entries.length) {
      const rowsToSave = input.entries.map((entry) => ({
        estagiario_id: student.id,
        tri_ref: entry.ref,
        meta: 0,
        producao: entry.value,
      }));
      const { error } = await supabase.from("producao_trimestral").upsert(rowsToSave, {
        onConflict: "estagiario_id,tri_ref",
      });
      if (error) throw error;
    }

    if (input.productTargets) {
      const productTargetRows = input.productTargets.map((target, itemIndex) => ({
        estagiario_id: student.id,
        tri_ref: productTargetRef(input.quarterRef, itemIndex),
        meta: target,
        producao: 0,
      }));
      const { error } = await supabase
        .from("producao_trimestral")
        .upsert(productTargetRows, { onConflict: "estagiario_id,tri_ref" });
      if (error) throw error;
    }

    const { data: productionRows, error: rowsError } = await supabase
      .from("producao_trimestral")
      .select("*")
      .eq("estagiario_id", student.id)
      .like("tri_ref", `${input.quarterRef}%`);
    if (rowsError) throw rowsError;

    const summary = summarizeProduction(productionRows ?? [], input.quarterRef, input.target);
    const { data: aggregate, error: aggregateError } = await supabase
      .from("producao_trimestral")
      .upsert(
        {
          estagiario_id: student.id,
          tri_ref: input.quarterRef,
          meta: input.target,
          producao: summary.credit,
        },
        { onConflict: "estagiario_id,tri_ref" },
      )
      .select()
      .single();
    if (aggregateError) throw aggregateError;

    const { data: snapshot, error: snapshotError } = await supabase
      .from("snapshots")
      .upsert(
        {
          estagiario_id: student.id,
          tri_ref: input.quarterRef,
          score: summary.score,
          score_producao: summary.creditScore,
          score_trilha: summary.productsScore,
          total_producao: summary.total,
          meta: input.target,
        },
        { onConflict: "estagiario_id,tri_ref" },
      )
      .select()
      .single();
    if (snapshotError) throw snapshotError;

    let profile = (student.perfil ?? {}) as Record<string, unknown>;
    let confirmed = false;
    if (hasProductionEntries(input)) {
      const verification = markProductionVerified(profile, config);
      profile = verification.profile;
      confirmed = verification.confirmed;
      const { error: profileError } = await supabase
        .from("estagiarios")
        .update({ perfil: profile as Json })
        .eq("id", student.id);
      if (profileError) throw profileError;
    }

    const rows = (productionRows ?? []).filter(
      (row) => row.tri_ref !== input.quarterRef,
    );
    rows.push(aggregate);
    return Response.json({
      studentId: student.id,
      quarterRef: input.quarterRef,
      productionRows: rows,
      snapshot,
      profile,
      confirmed,
      // Gestores carregam o histórico já filtrado pela rota de bootstrap.
      // Não devolvemos o snapshot global após salvar produção para não expor
      // pendências de outras regionais no payload da requisição.
      ...(session.role === "tutora" ? { productionAuditHistory } : {}),
    });
  } catch (error) {
    return productionErrorResponse(error);
  }
}
