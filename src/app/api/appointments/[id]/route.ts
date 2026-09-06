import { parseAppointment, parseUuid } from "@/domain/admin-mutations";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { removeAppointmentFile } from "@/server/appointment-storage";
import {
  assertSameOrigin,
  isGgaEquivalent,
  loadSessionManager,
  ProductionHttpError,
  productionErrorResponse,
  requireProductionSession,
} from "@/server/production-access";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    const id = parseUuid((await params).id, "Agendamento");
    const input = parseAppointment(await request.json().catch(() => null));
    const supabase = createSupabaseAdminClient();
    const current = await authorizeAppointment(supabase, session, id);
    const { data, error } = await supabase
      .from("agendamentos")
      .update({
        titulo: input.title,
        descricao: input.description,
        data: input.date,
        tipo: input.type,
        fase_alvo: input.targetPhase,
        arquivo_url: input.fileUrl,
        arquivo_nome: input.fileName,
        presenca: input.presence,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (current.arquivo_url && current.arquivo_url !== input.fileUrl) {
      await removeAppointmentFile(supabase, current.arquivo_url);
    }
    return Response.json({ appointment: data });
  } catch (error) {
    return productionErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    const id = parseUuid((await params).id, "Agendamento");
    const supabase = createSupabaseAdminClient();
    const current = await authorizeAppointment(supabase, session, id);
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (error) throw error;
    await removeAppointmentFile(supabase, current.arquivo_url);
    return Response.json({ ok: true });
  } catch (error) {
    return productionErrorResponse(error);
  }
}

async function authorizeAppointment(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  session: Awaited<ReturnType<typeof requireProductionSession>>,
  id: string,
) {
  const { data, error } = await supabase
    .from("agendamentos")
    .select("id,gestor_id,arquivo_url")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new ProductionHttpError("Agendamento nao encontrado.", 404);
  if (session.role === "tutora") return data;
  const manager = await loadSessionManager(supabase, session);
  const permissions = (manager.permissoes ?? {}) as Record<string, unknown>;
  const canEditAnyAppointment =
    isGgaEquivalent(manager.tipo_gestor) ||
    (manager.tipo_gestor !== "lider_regional" && permissions.todos_estagiarios === true);
  if (data.gestor_id !== manager.id && !canEditAnyAppointment) {
    throw new ProductionHttpError("Sem permissao para alterar este agendamento.", 403);
  }
  return data;
}
