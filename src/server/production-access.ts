import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  type SessionPayload,
  verifySessionToken,
} from "@/lib/session";

export class ProductionHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function requireProductionSession() {
  const session = await getProductionSession();
  if (!session) throw new ProductionHttpError("Faca login novamente.", 401);
  return session;
}

export async function getProductionSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export function requireTutorSession(session: SessionPayload) {
  if (session.role !== "tutora") {
    throw new ProductionHttpError("Apenas a tutora pode concluir esta operacao.", 403);
  }
}

export async function requireTutorOrManagerPermission(
  supabase: SupabaseClient,
  session: SessionPayload,
  permission: string,
) {
  if (session.role === "tutora") return null;
  const manager = await loadSessionManager(supabase, session);
  const permissions = (manager.permissoes ?? {}) as Record<string, unknown>;
  if (permissions[permission] !== true) {
    throw new ProductionHttpError("Sem permissao para acessar esta area.", 403);
  }
  return manager;
}

export async function loadSessionManager(
  supabase: SupabaseClient,
  session: SessionPayload,
) {
  if (session.role !== "gestor") {
    throw new ProductionHttpError("Gestor nao autenticado.", 403);
  }
  const { data: manager, error } = await supabase
    .from("gestores")
    .select("id,nome,funcional,agencia,permissoes,tipo_gestor,regional_id")
    .eq("id", session.subject)
    .maybeSingle();
  if (error) throw error;
  if (!manager) throw new ProductionHttpError("Gestor nao encontrado.", 403);
  return manager;
}

export async function requireTutorOrGga(
  supabase: SupabaseClient,
  session: SessionPayload,
) {
  if (session.role === "tutora") return null;
  const manager = await loadSessionManager(supabase, session);
  if (!isGgaEquivalent(manager.tipo_gestor)) {
    throw new ProductionHttpError("Apenas a tutora, um GGA ou um facilitador pode concluir esta operacao.", 403);
  }
  return manager;
}

/** Facilitadores possuem o mesmo alcance operacional do GGA. */
export function isGgaEquivalent(managerType: string | null | undefined) {
  return managerType === "gga" || managerType === "facilitador";
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new ProductionHttpError("Origem da solicitacao invalida.", 403);
  }
}

export async function authorizeStudentWrite(
  supabase: SupabaseClient,
  session: SessionPayload,
  studentId: string,
) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      studentId,
    );

  let studentQuery = supabase
    .from("estagiarios")
    .select("id,perfil,gestor_funcional,regional_id");

  if (isUuid) {
    studentQuery = studentQuery.eq("id", studentId);
  } else {
    studentQuery = studentQuery.or(
      `id.eq.${studentId},perfil->>funcional.eq.${studentId}`,
    );
  }

  const { data: student, error: studentError } =
    await studentQuery.maybeSingle();
  if (studentError) throw studentError;
  if (!student)
    throw new ProductionHttpError("Estagiario nao encontrado.", 404);

  if (session.role === "tutora") return student;

  const { data: manager, error: managerError } = await supabase
    .from("gestores")
    .select("id,funcional,permissoes,tipo_gestor,regional_id")
    .eq("id", session.subject)
    .maybeSingle();
  if (managerError) throw managerError;
  if (!manager) throw new ProductionHttpError("Gestor nao encontrado.", 403);

  const hasRegional = Boolean(manager.regional_id);
  const sameRegional = hasRegional && String(student.regional_id ?? "") === String(manager.regional_id);

  if (!sameRegional) {
    throw new ProductionHttpError("Sem permissao para este estagiario.", 403);
  }
  return student;
}

export function productionErrorResponse(error: unknown) {
  if (error instanceof ProductionHttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Erro seguro de producao:", error);
  return Response.json(
    { error: "Nao foi possivel concluir a operacao agora." },
    { status: 503 },
  );
}
