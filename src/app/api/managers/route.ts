import { parseManagerCreate } from "@/domain/admin-mutations";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { hashManagerPassword, safeManager } from "@/server/manager-security";
import {
  assertSameOrigin,
  ProductionHttpError,
  productionErrorResponse,
  requireProductionSession,
  requireTutorSession,
} from "@/server/production-access";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireProductionSession();
    requireTutorSession(session);
    const input = parseManagerCreate(await request.json().catch(() => null));
    const supabase = createSupabaseAdminClient();
    const { data: duplicate, error: duplicateError } = await supabase
      .from("gestores")
      .select("id")
      .eq("funcional", input.employeeCode)
      .maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate) throw new ProductionHttpError("Ja existe um gestor com este funcional.", 409);
    const { data, error } = await supabase
      .from("gestores")
      .insert({
        nome: input.name,
        funcional: input.employeeCode,
        agencia: input.agency,
        regional_id: input.regionalId,
        ...(input.managerType ? { tipo_gestor: input.managerType } : {}),
        ...(input.managerType === "gga" || input.managerType === "facilitador"
          ? {
              permissoes: {
                trilhas: true,
                ranking: true,
                todos_estagiarios: true,
                configuracoes: true,
              },
            }
          : {}),
        senha_hash: hashManagerPassword(input.employeeCode.slice(0, 4)),
      })
      .select("id,nome,funcional,agencia,permissoes,tipo_gestor,regional_id")
      .single();
    if (error) throw error;
    return Response.json({ manager: safeManager(data) }, { status: 201 });
  } catch (error) {
    return productionErrorResponse(error);
  }
}
