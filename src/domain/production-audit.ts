import {
  getCurrentProductionDeadline,
  isYmd,
  localYmd,
  type ProductionConfig,
} from "./production-deadline.ts";

export const PRODUCTION_AUDIT_SETTING_ID = "historico_pendencias_producao";
const MAX_AUDIT_WEEKS = 26;

type UnknownRecord = Record<string, unknown>;

export type ProductionAuditStudent = {
  id: string;
  nome: string;
  funcional?: string | null;
  /** Regional registrada no momento da auditoria. */
  regionalId?: string | null;
  responsibleManagers?: ProductionAuditManager[];
};

export type ProductionAuditManager = {
  id: string;
  nome: string;
  funcional: string;
  tipo: string;
};

export type ProductionAuditEntry = {
  deadline: string;
  capturedAt: string;
  pending: ProductionAuditStudent[];
};

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function addDays(ymd: string, amount: number) {
  const date = new Date(`${ymd}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function getMostRecentlyClosedDeadline(
  config: ProductionConfig | null | undefined,
  now = new Date(),
) {
  const today = localYmd(now);
  const currentDeadline = getCurrentProductionDeadline(config, now);
  return today > currentDeadline ? currentDeadline : addDays(currentDeadline, -7);
}

export function buildProductionAuditEntry(
  students: Array<{
    id: string;
    nome: string;
    perfil?: unknown;
    gestor_funcional?: string | null;
    regional_id?: string | null;
  }>,
  deadline: string,
  capturedAt = new Date().toISOString(),
  managers: Array<{
    id: string;
    nome: string;
    funcional?: string | null;
    tipo_gestor?: string | null;
  }> = [],
): ProductionAuditEntry {
  const managersByEmployeeCode = new Map(
    managers.map((manager) => [String(manager.funcional ?? ""), manager]),
  );
  const pending = students
    .filter((student) => {
      const profile = record(student.perfil);
      return profile.producao_verificada_prazo !== deadline;
    })
    .map((student) => {
      const profile = record(student.perfil);
      const managerCodes = [
        profile.ga_funcional,
        profile.gga_funcional,
        student.gestor_funcional,
      ]
        .filter((value): value is string => typeof value === "string" && Boolean(value))
        .filter((value, index, values) => values.indexOf(value) === index);
      const responsibleManagers = managerCodes
        .map((employeeCode) => managersByEmployeeCode.get(employeeCode))
        .filter((manager) => manager !== undefined)
        .map((manager) => ({
          id: String(manager.id),
          nome: String(manager.nome || "Gestor"),
          funcional: String(manager.funcional || ""),
          tipo: String(manager.tipo_gestor || "gestor").toUpperCase(),
        }));
      return {
        id: String(student.id),
        nome: String(student.nome || "Estagiário"),
        funcional:
          typeof profile.funcional === "string" ? profile.funcional : null,
        regionalId:
          typeof student.regional_id === "string" && student.regional_id
            ? student.regional_id
            : null,
        responsibleManagers,
      };
    })
    .sort((left, right) => left.nome.localeCompare(right.nome, "pt-BR"));

  return { deadline, capturedAt, pending };
}

export function normalizeProductionAuditHistory(value: unknown) {
  const source = record(value);
  if (!Array.isArray(source.entries)) return [] as ProductionAuditEntry[];
  const entries: ProductionAuditEntry[] = [];
  for (const rawEntry of source.entries) {
    const entry = record(rawEntry);
    if (!isYmd(entry.deadline) || typeof entry.capturedAt !== "string") continue;
    const pending: ProductionAuditStudent[] = [];
    if (Array.isArray(entry.pending)) {
      for (const rawStudent of entry.pending) {
        const student = record(rawStudent);
        if (typeof student.id !== "string" || typeof student.nome !== "string") continue;
        const responsibleManagers: ProductionAuditManager[] = [];
        if (Array.isArray(student.responsibleManagers)) {
          for (const rawManager of student.responsibleManagers) {
            const manager = record(rawManager);
            if (
              typeof manager.id !== "string" ||
              typeof manager.nome !== "string" ||
              typeof manager.funcional !== "string" ||
              typeof manager.tipo !== "string"
            ) continue;
            responsibleManagers.push({
              id: manager.id,
              nome: manager.nome.slice(0, 120),
              funcional: manager.funcional.slice(0, 9),
              tipo: manager.tipo.slice(0, 30),
            });
          }
        }
        const normalizedStudent: ProductionAuditStudent = {
          id: student.id,
          nome: student.nome.slice(0, 120),
          funcional:
            typeof student.funcional === "string"
              ? student.funcional.slice(0, 9)
              : null,
          responsibleManagers,
        };
        if (typeof student.regionalId === "string" && student.regionalId) {
          normalizedStudent.regionalId = student.regionalId.slice(0, 128);
        }
        pending.push(normalizedStudent);
      }
    }
    entries.push({ deadline: entry.deadline, capturedAt: entry.capturedAt, pending });
  }
  return entries
    .sort((left, right) => right.deadline.localeCompare(left.deadline))
    .slice(0, MAX_AUDIT_WEEKS);
}

/**
 * Os históricos anteriores à regionalização não tinham a regional no snapshot.
 * Complementamos somente os itens sem regional a partir do cadastro atual, sem
 * sobrescrever a regional que já foi registrada na semana auditada.
 */
export function enrichProductionAuditHistoryRegionals(
  history: ProductionAuditEntry[],
  students: Array<{ id: string; regional_id?: string | null }>,
) {
  const regionalByStudentId = new Map(
    students.map((student) => [
      String(student.id),
      typeof student.regional_id === "string" && student.regional_id
        ? student.regional_id
        : null,
    ]),
  );

  return history.map((entry) => ({
    ...entry,
    pending: entry.pending.map((student) => ({
      ...student,
      regionalId:
        student.regionalId ?? regionalByStudentId.get(String(student.id)) ?? null,
    })),
  }));
}

export function filterProductionAuditHistoryByRegional(
  history: ProductionAuditEntry[],
  regionalId?: string | null,
) {
  if (!regionalId) return history;
  return history
    .map((entry) => ({
      ...entry,
      pending: entry.pending.filter(
        (student) => String(student.regionalId ?? "") === String(regionalId),
      ),
    }))
    .filter((entry) => entry.pending.length > 0);
}

export function mergeProductionAuditEntry(
  history: ProductionAuditEntry[],
  entry: ProductionAuditEntry,
) {
  return [entry, ...history.filter((item) => item.deadline !== entry.deadline)]
    .sort((left, right) => right.deadline.localeCompare(left.deadline))
    .slice(0, MAX_AUDIT_WEEKS);
}
