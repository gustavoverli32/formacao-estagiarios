import type { Json } from "@/types/database";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown, message = "Dados invalidos."): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
  return value as UnknownRecord;
}

function cleanString(
  value: unknown,
  label: string,
  maxLength: number,
  required = false,
) {
  const result = typeof value === "string" ? value.trim() : "";
  if (required && !result) throw new Error(`${label} e obrigatorio.`);
  if (result.length > maxLength) throw new Error(`${label} e muito longo.`);
  return result;
}

function optionalUuid(value: unknown, label: string) {
  const result = cleanString(value, label, 36);
  if (result && !UUID_PATTERN.test(result)) throw new Error(`${label} invalido.`);
  return result || null;
}

export function parseUuid(value: unknown, label = "Identificador") {
  const result = optionalUuid(value, label);
  if (!result) throw new Error(`${label} invalido.`);
  return result;
}

export function parseYmd(value: unknown, label = "Data") {
  const result = cleanString(value, label, 10, true);
  const parsed = new Date(`${result}T12:00:00Z`);
  if (
    !YMD_PATTERN.test(result) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== result
  ) {
    throw new Error(`${label} invalida.`);
  }
  return result;
}

function cleanDigits(value: unknown, label: string, maxLength: number, required = false) {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if (required && digits.length !== maxLength) {
    throw new Error(`${label} deve ter ${maxLength} digitos.`);
  }
  if (digits.length > maxLength) throw new Error(`${label} invalido.`);
  return digits;
}

function cleanJson(value: unknown, label: string, maxBytes: number): Json {
  const serialized = JSON.stringify(value);
  if (serialized === undefined || serialized.length > maxBytes) {
    throw new Error(`${label} invalido ou muito grande.`);
  }
  return JSON.parse(serialized) as Json;
}

function cleanStudentProfile(value: unknown) {
  const profile = asRecord(value, "Perfil do estagiario invalido.");
  const result: Record<string, Json | undefined> = {
    funcional: cleanDigits(profile.funcional, "Funcional", 9, true),
    agencia: cleanString(profile.agencia, "Agencia", 60),
    inicio: profile.inicio ? parseYmd(profile.inicio, "Data de inicio") : "",
    ga_funcional: cleanDigits(profile.ga_funcional, "Funcional do GA", 9),
    gga_funcional: cleanDigits(profile.gga_funcional, "Funcional do GGA", 9),
    certificacao: cleanString(profile.certificacao, "Certificacao", 40) || null,
    mes_aniversario:
      cleanString(profile.mes_aniversario, "Aniversario", 5) || null,
    trilha_manual:
      cleanString(profile.trilha_manual, "Trilha", 30) || null,
  };

  for (const key of ["ultima_atualizacao_prod", "producao_verificada_prazo"] as const) {
    if (profile[key]) result[key] = parseYmd(profile[key], "Data de producao");
  }

  return result as Json;
}

function cleanTrailChecks(value: unknown) {
  const checks = asRecord(value, "Checklist de trilha invalido.");
  const result: Record<string, boolean[]> = {};
  for (const [key, raw] of Object.entries(checks)) {
    if (!/^(iniciante|intermediario|avancado)_\d+$/.test(key)) continue;
    if (!Array.isArray(raw) || raw.length > 12 || raw.some((item) => typeof item !== "boolean")) {
      throw new Error("Checklist de trilha invalido.");
    }
    result[key] = raw;
  }
  return result as Json;
}

export type StudentMutationInput = {
  name: string;
  months: string[];
  notes: string;
  attention: boolean;
  profile: Json;
  trailChecks: Json;
  regionalId?: string | null;
};

export function parseStudentMutation(value: unknown): StudentMutationInput {
  const body = asRecord(value, "Dados do estagiario invalidos.");
  const rawMonths = Array.isArray(body.months) ? body.months : [];
  if (
    rawMonths.length !== 6 ||
    rawMonths.some((item) => typeof item !== "string" || item.length > 60)
  ) {
    throw new Error("Ciclos do estagiario invalidos.");
  }
  return {
    name: cleanString(body.name, "Nome", 120, true),
    months: rawMonths,
    notes: cleanString(body.notes, "Observacoes", 10_000),
    attention: body.attention === true,
    profile: cleanStudentProfile(body.profile),
    trailChecks: cleanTrailChecks(body.trailChecks),
    regionalId: optionalUuid(body.regional_id ?? body.regionalId, "Regional"),
  };
}

export type ManagerCreateInput = {
  name: string;
  employeeCode: string;
  agency: string;
  regionalId: string;
  managerType?: "ga" | "gga" | "facilitador" | "tutor";
};

export function parseManagerCreate(value: unknown): ManagerCreateInput {
  const body = asRecord(value, "Dados do gestor invalidos.");
  const managerType = body.managerType ?? body.tipo_gestor;
  if (
    managerType !== undefined &&
    managerType !== "ga" &&
    managerType !== "gga" &&
    managerType !== "facilitador" &&
    managerType !== "tutor"
  ) {
    throw new Error("Tipo de gestor invalido.");
  }
  return {
    name: cleanString(body.name, "Nome", 120, true),
    employeeCode: cleanDigits(body.employeeCode, "Funcional", 9, true),
    agency: cleanString(body.agency, "Agencia", 60, true),
    regionalId: parseUuid(body.regionalId ?? body.regional_id, "Regional"),
    ...(managerType !== undefined ? { managerType } : {}),
  };
}

export type ManagerSelfInput = Omit<ManagerCreateInput, "agency" | "regionalId"> & {
  password: string;
};

export function parseManagerSelf(value: unknown): ManagerSelfInput {
  const body = asRecord(value, "Dados do gestor invalidos.");
  const base = {
    name: cleanString(body.name, "Nome", 120, true),
    employeeCode: cleanDigits(body.employeeCode, "Funcional", 9, true),
  };
  const password = cleanString(body.password, "Senha", 128);
  if (password && password.length < 4) throw new Error("Senha deve ter ao menos 4 caracteres.");
  return { ...base, password };
}

export type ManagerAdminInput = {
  permissions: {
    trilhas: boolean;
    ranking: boolean;
    todos_estagiarios: boolean;
    configuracoes: boolean;
  };
  managerType: "ga" | "gga" | "facilitador" | "lider_regional";
  password: string;
};

export function parseManagerAdmin(value: unknown): ManagerAdminInput {
  const body = asRecord(value, "Permissoes invalidas.");
  const permissions = asRecord(body.permissions, "Permissoes invalidas.");
  const managerType = body.managerType;
  if (
    managerType !== "ga" &&
    managerType !== "gga" &&
    managerType !== "facilitador" &&
    managerType !== "lider_regional"
  ) {
    throw new Error("Tipo de gestor invalido.");
  }
  const password = cleanString(body.password, "Senha", 128);
  if (password && password.length < 4) throw new Error("Senha deve ter ao menos 4 caracteres.");
  return {
    permissions: {
      trilhas: permissions.trilhas === true,
      ranking: permissions.ranking === true,
      todos_estagiarios: permissions.todos_estagiarios === true,
      configuracoes: permissions.configuracoes === true,
    },
    managerType,
    password,
  };
}

export function parseLegacySetting(value: unknown) {
  const body = asRecord(value, "Configuracao invalida.");
  if (body.key === "timeline") {
    if (
      !Array.isArray(body.value) ||
      body.value.length !== 6 ||
      body.value.some((item) => typeof item !== "boolean")
    ) {
      throw new Error("Linha do tempo invalida.");
    }
    return { key: "timeline" as const, value: body.value as Json };
  }
  if (body.key === "textos_projeto") {
    const texts = asRecord(body.value, "Textos do projeto invalidos.");
    const allowed = [
      "banner_over",
      "banner_titulo",
      "banner_desc",
      "sec_objetivo",
      "sec_estrutura",
      "sec_avaliacao",
      "sec_participa",
      "sec_acomp",
    ];
    const result: Record<string, string> = {};
    for (const key of allowed) result[key] = cleanString(texts[key], "Texto", 6_000, true);
    return { key: "textos_projeto" as const, value: cleanJson(result, "Textos", 30_000) };
  }
  if (body.key === "checklist_mensal") {
    const config = asRecord(body.value, "Programacao do checklist invalida.");
    return {
      key: "checklist_mensal" as const,
      value: { enabled: config.enabled !== false } as Json,
    };
  }
  throw new Error("Configuracao nao permitida.");
}

export type ManagerProfileAdminInput = { name: string; agency: string; regionalId: string };

export function parseManagerProfileAdmin(value: unknown): ManagerProfileAdminInput {
  const body = asRecord(value, "Dados do gestor invalidos.");
  return {
    name: cleanString(body.name, "Nome", 120, true),
    agency: cleanString(body.agency, "Agencia", 60, true),
    regionalId: parseUuid(body.regionalId ?? body.regional_id, "Regional"),
  };
}

export function parseMeeting(value: unknown) {
  const body = asRecord(value, "Encontro invalido.");
  return {
    title: cleanString(body.title, "Titulo", 150, true),
    date: parseYmd(body.date),
    description: cleanString(body.description, "Descricao", 3_000),
  };
}

export function parseAppointment(value: unknown) {
  const body = asRecord(value, "Agendamento invalido.");
  const type = cleanString(body.type, "Tipo", 30) || "aula";
  const phase = cleanString(body.targetPhase, "Publico", 20) || "todos";
  if (!["aula", "workshop", "treinamento", "reuniao", "outro"].includes(type)) {
    throw new Error("Tipo de agendamento invalido.");
  }
  if (!["todos", "fase1", "fase2", "fase3"].includes(phase)) {
    throw new Error("Publico do agendamento invalido.");
  }
  const presence = Array.isArray(body.presence) ? body.presence : [];
  if (presence.length > 100) throw new Error("Lista de presenca muito grande.");
  const cleanedPresence = presence.map((entry) => {
    const item = asRecord(entry, "Presenca invalida.");
    return {
      estagiario_id: parseUuid(item.studentId, "Estagiario"),
      presente: item.present === true,
    };
  });
  const fileUrl = cleanString(body.fileUrl, "Arquivo", 1_000);
  if (fileUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(fileUrl);
    } catch {
      throw new Error("Endereco do arquivo invalido.");
    }
    const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const configuredOrigin = configuredUrl ? new URL(configuredUrl).origin : null;
    if (
      (configuredOrigin && parsedUrl.origin !== configuredOrigin) ||
      !parsedUrl.pathname.startsWith(
        "/storage/v1/object/public/arquivos/agendamentos/",
      )
    ) {
      throw new Error("Endereco do arquivo invalido.");
    }
  }
  return {
    title: cleanString(body.title, "Titulo", 120, true),
    date: parseYmd(body.date),
    type,
    targetPhase: phase,
    description: cleanString(body.description, "Descricao", 5_000),
    fileUrl: fileUrl || null,
    fileName: cleanString(body.fileName, "Nome do arquivo", 255) || null,
    presence: cleanJson(cleanedPresence, "Presenca", 30_000),
  };
}
