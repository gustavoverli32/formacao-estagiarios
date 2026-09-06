import "server-only";

import {
  buildProductionAuditEntry,
  getMostRecentlyClosedDeadline,
  mergeProductionAuditEntry,
  normalizeProductionAuditHistory,
  PRODUCTION_AUDIT_SETTING_ID,
} from "@/domain/production-audit";
import type { ProductionConfig } from "@/domain/production-deadline";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import type { Json } from "@/types/database";

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

export async function ensureLatestProductionAudit(
  supabase: AdminClient,
  config: ProductionConfig,
  now = new Date(),
) {
  const deadline = getMostRecentlyClosedDeadline(config, now);
  const { data: historyRow, error: historyError } = await supabase
    .from("configuracoes")
    .select("valor")
    .eq("id", PRODUCTION_AUDIT_SETTING_ID)
    .maybeSingle();
  if (historyError) throw historyError;

  const history = normalizeProductionAuditHistory(historyRow?.valor);
  if (history.some((entry) => entry.deadline === deadline)) return history;

  const { data: students, error: studentsError } = await supabase
    .from("estagiarios")
    .select("id,nome,perfil,gestor_funcional,regional_id")
    .is("arquivado_em", null)
    .order("nome");
  if (studentsError) throw studentsError;

  const { data: managers, error: managersError } = await supabase
    .from("gestores")
    .select("id,nome,funcional,tipo_gestor")
    .order("nome");
  if (managersError) throw managersError;

  const entry = buildProductionAuditEntry(
    students ?? [],
    deadline,
    new Date().toISOString(),
    managers ?? [],
  );
  const nextHistory = mergeProductionAuditEntry(history, entry);
  const { error: saveError } = await supabase.from("configuracoes").upsert({
    id: PRODUCTION_AUDIT_SETTING_ID,
    valor: { entries: nextHistory } as Json,
  });
  if (saveError) throw saveError;
  return nextHistory;
}
