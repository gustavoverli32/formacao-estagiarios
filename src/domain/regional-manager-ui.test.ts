import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const sourceHtml = readFileSync("src/legacy/source.html", "utf8");
const sourceApp = readFileSync("assets/js/app.js", "utf8");
const appointmentRoute = readFileSync("src/app/api/appointments/[id]/route.ts", "utf8");
const bootstrapRoute = readFileSync("src/app/api/data/bootstrap/route.ts", "utf8");
const assistantRoute = readFileSync("src/app/api/assistant/route.ts", "utf8");
const studentAccess = readFileSync("src/server/production-access.ts", "utf8");

test("exposes Gerente Regional in the permission dialog", () => {
  assert.match(sourceHtml, /id="tipoLiderRegional"/);
  assert.match(sourceHtml, /Gerente Regional/);
  assert.match(sourceApp, /tipoLiderRegional/);
});

test("exposes Facilitador with the same client access path as GGA", () => {
  assert.match(sourceHtml, /id="tipoFacilitador"/);
  assert.match(sourceHtml, /Mesmo acesso do GGA/);
  assert.match(sourceApp, /gestorLogado\.tipo_gestor === 'facilitador'/);
  assert.match(sourceApp, /tipoFacilitador\.onchange/);
});

test("lets only the regional manager switch regional views", () => {
  assert.match(sourceApp, /function isGerenteRegional\(\)/);
  assert.match(sourceApp, /if\(tipo === 'lider_regional'\) return true/);
  assert.match(sourceApp, /if\(editor\)/);
  assert.match(sourceApp, /if\(modoGestor && gestorLogado && !isGerenteRegional\(\)\)/);
  assert.match(sourceApp, /if\(editor\)\{\s*html \+= '<option value="all"/);
  assert.match(sourceApp, /function getRegionalDoGestorLogado\(\)/);
  assert.match(appointmentRoute, /manager\.tipo_gestor !== "lider_regional"/);
});

test("keeps every non-regional manager inside their assigned regional in the APIs", () => {
  assert.match(bootstrapRoute, /const canSwitchRegionals = currentManager\.tipo_gestor === "lider_regional"/);
  assert.match(bootstrapRoute, /isStudentInRegional\(row, currentManager\.regional_id\)/);
  assert.match(assistantRoute, /manager\.tipo_gestor !== "lider_regional"/);
  assert.match(assistantRoute, /isStudentInRegional\(student, manager\.regional_id\)/);
  assert.match(studentAccess, /if \(!sameRegional\)/);
});
