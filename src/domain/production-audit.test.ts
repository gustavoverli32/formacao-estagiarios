import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProductionAuditEntry,
  enrichProductionAuditHistoryRegionals,
  filterProductionAuditHistoryByRegional,
  getMostRecentlyClosedDeadline,
  mergeProductionAuditEntry,
  normalizeProductionAuditHistory,
} from "./production-audit.ts";

test("finds the latest deadline that has already closed", () => {
  assert.equal(
    getMostRecentlyClosedDeadline({}, new Date("2026-08-16T12:00:00-03:00")),
    "2026-08-14",
  );
  assert.equal(
    getMostRecentlyClosedDeadline({}, new Date("2026-08-17T12:00:00-03:00")),
    "2026-08-14",
  );
  assert.equal(
    getMostRecentlyClosedDeadline({}, new Date("2026-08-21T12:00:00-03:00")),
    "2026-08-14",
  );
});

test("captures only students who did not confirm the requested deadline", () => {
  const entry = buildProductionAuditEntry(
    [
      { id: "1", nome: "Ana", perfil: { funcional: "111", producao_verificada_prazo: "2026-08-14" } },
      { id: "2", nome: "Beatriz", perfil: { funcional: "222", ga_funcional: "222", producao_verificada_prazo: "2026-08-07" } },
      { id: "3", nome: "Deivid", perfil: { funcional: "333" } },
    ],
    "2026-08-14",
    "2026-08-15T03:00:00.000Z",
    [{ id: "m1", nome: "Gestora B", funcional: "222", tipo_gestor: "ga" }],
  );
  assert.deepEqual(entry.pending.map((student) => student.nome), ["Beatriz", "Deivid"]);
  assert.deepEqual(entry.pending[0].responsibleManagers?.map((manager) => manager.nome), ["Gestora B"]);
});

test("keeps one immutable audit per deadline and sanitizes stored history", () => {
  const oldEntry = {
    deadline: "2026-08-07",
    capturedAt: "2026-08-08T03:00:00.000Z",
    pending: [],
  };
  const newEntry = {
    deadline: "2026-08-14",
    capturedAt: "2026-08-15T03:00:00.000Z",
    pending: [{ id: "2", nome: "Beatriz", funcional: "222", responsibleManagers: [] }],
  };
  const merged = mergeProductionAuditEntry([oldEntry], newEntry);
  assert.deepEqual(merged.map((entry) => entry.deadline), ["2026-08-14", "2026-08-07"]);
  assert.deepEqual(normalizeProductionAuditHistory({ entries: merged }), merged);
});

test("keeps the regional snapshot and enriches legacy pending entries", () => {
  const entry = buildProductionAuditEntry(
    [
      { id: "1", nome: "Ana", regional_id: "regional-a", perfil: {} },
      { id: "2", nome: "Bia", regional_id: "regional-b", perfil: {} },
    ],
    "2026-08-14",
  );
  assert.equal(entry.pending[0].regionalId, "regional-a");

  const enriched = enrichProductionAuditHistoryRegionals(
    [
      {
        deadline: "2026-08-07",
        capturedAt: "2026-08-08T03:00:00.000Z",
        pending: [{ id: "2", nome: "Bia", responsibleManagers: [] }],
      },
    ],
    [{ id: "2", regional_id: "regional-b" }],
  );
  assert.equal(enriched[0].pending[0].regionalId, "regional-b");
  assert.deepEqual(
    filterProductionAuditHistoryByRegional([entry, ...enriched], "regional-b").map(
      (audit) => audit.deadline,
    ),
    ["2026-08-14", "2026-08-07"],
  );
});
