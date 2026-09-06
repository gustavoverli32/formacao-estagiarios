import { parseStudentMutation, parseUuid } from "@/domain/admin-mutations";
import { didTrailChecklistChange } from "@/domain/monthly-checklist";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import {
  assertSameOrigin,
  authorizeStudentWrite,
  isGgaEquivalent,
  loadSessionManager,
  ProductionHttpError,
  productionErrorResponse,
  requireProductionSession,
  requireTutorOrGga,
} from "@/server/production-access";
import type { Json } from "@/types/database";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    const id = parseUuid((await params).id, "Estagiario");
    const input = parseStudentMutation(await request.json().catch(() => null));
    const supabase = createSupabaseAdminClient();

    const { data: current, error: currentError } = await supabase
      .from("estagiarios")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) throw new ProductionHttpError("Estagiario nao encontrado.", 404);
    const checklistChanged = didTrailChecklistChange(
      current.trilha_checks,
      input.trailChecks,
    );
    const checklistUpdatedAt = checklistChanged ? new Date().toISOString() : null;

    let update;
    let fullAccess = session.role === "tutora";
    if (session.role === "gestor") {
      const manager = await loadSessionManager(supabase, session);
      if (!manager.regional_id) {
        throw new ProductionHttpError("Gestor sem regional vinculada.", 403);
      }
      if (input.regionalId && input.regionalId !== manager.regional_id) {
        throw new ProductionHttpError("Gestores só podem manter estagiários na própria regional.", 403);
      }
      await authorizeStudentWrite(supabase, session, id);
      if (!isGgaEquivalent(manager.tipo_gestor)) {
        const permissions = (manager.permissoes ?? {}) as Record<string, unknown>;
        if (permissions.trilhas !== true) {
          throw new ProductionHttpError("Sem permissao para editar trilhas.", 403);
        }
        const currentProfile = (current.perfil ?? {}) as Record<string, Json | undefined>;
        const requestedProfile = input.profile as Record<string, Json | undefined>;
        update = {
          perfil: {
            ...currentProfile,
            trilha_manual: requestedProfile.trilha_manual ?? null,
            ...(checklistUpdatedAt
              ? { ultima_atualizacao_checklist_trilha: checklistUpdatedAt }
              : {}),
          } as Json,
          trilha_checks: input.trailChecks,
        };
      } else {
        fullAccess = true;
        update = buildFullUpdate(current, input, checklistUpdatedAt);
      }
    } else {
      update = buildFullUpdate(current, input, checklistUpdatedAt);
    }

    if ("perfil" in update && fullAccess) {
      const employeeCode = String(
        ((update.perfil ?? {}) as Record<string, Json | undefined>).funcional ?? "",
      );
      const { data: duplicate, error: duplicateError } = await supabase
        .from("estagiarios")
        .select("id")
        .eq("perfil->>funcional", employeeCode)
        .neq("id", id)
        .limit(1)
        .maybeSingle();
      if (duplicateError) throw duplicateError;
      if (duplicate) throw new ProductionHttpError("Ja existe um estagiario com este funcional.", 409);
    }

    const { data, error } = await supabase
      .from("estagiarios")
      .update(update)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return Response.json({ student: data });
  } catch (error) {
    return productionErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    const id = parseUuid((await params).id, "Estagiario");
    const supabase = createSupabaseAdminClient();
    await requireTutorOrGga(supabase, session);
    await authorizeStudentWrite(supabase, session, id);
    const { error } = await supabase.from("estagiarios").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return productionErrorResponse(error);
  }
}

function buildFullUpdate(
  current: { perfil: Json | null; regional_id?: string | null },
  input: ReturnType<typeof parseStudentMutation>,
  checklistUpdatedAt: string | null,
) {
  return {
    nome: input.name,
    meses: input.months,
    obs: input.notes,
    atencao: input.attention,
    perfil: {
      ...((current.perfil ?? {}) as Record<string, Json | undefined>),
      ...(input.profile as Record<string, Json | undefined>),
      ...(checklistUpdatedAt
        ? { ultima_atualizacao_checklist_trilha: checklistUpdatedAt }
        : {}),
    } as Json,
    trilha_checks: input.trailChecks,
    ...(input.regionalId ? { regional_id: input.regionalId } : {}),
  };
}
