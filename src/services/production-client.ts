import type { ProductionBatchInput, ProductionRow } from "@/domain/production";
import type { ContactsBatchInput } from "@/domain/contacts";
import {
  getCurrentProductionDeadline,
  getProductionUpdateStatus,
  getWeekStartYmd,
  markProductionVerified,
  quantityWeeksInMonth,
  type ProductionConfig,
  type ProductionProfile,
} from "@/domain/production-deadline";

export type ProductionBatchResult = {
  studentId: string;
  quarterRef: string;
  productionRows: ProductionRow[];
  snapshot: Record<string, unknown>;
  profile: ProductionProfile;
  confirmed: boolean;
  productionAuditHistory?: Array<Record<string, unknown>>;
};

type VerificationResult = ReturnType<typeof markProductionVerified>;

async function postJson<T>(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;
  if (!response.ok) {
    throw new Error(result?.error || "Nao foi possivel salvar os dados.");
  }
  return result as T;
}

export const nextuberProductionBridge = {
  quantityWeeksInMonth,
  getWeekStartYmd,
  getCurrentDeadline: getCurrentProductionDeadline,
  getUpdateStatus: getProductionUpdateStatus,
  markVerified: markProductionVerified,
  saveBatch(input: ProductionBatchInput) {
    return postJson<ProductionBatchResult>("/api/production/save", input);
  },
  verifyToday(studentId: string) {
    return postJson<VerificationResult>("/api/production/verify", { studentId });
  },
  saveDeadline(deadline: string) {
    return postJson<{
      config: ProductionConfig & Record<string, unknown>;
      deadline: string;
    }>("/api/settings/production-deadline", { deadline });
  },
  saveContacts(input: ContactsBatchInput) {
    return postJson<{
      contactRows: ProductionRow[];
      profile: ProductionProfile;
    }>("/api/contacts/save", input);
  },
};

export type NextuberProductionBridge = typeof nextuberProductionBridge;
