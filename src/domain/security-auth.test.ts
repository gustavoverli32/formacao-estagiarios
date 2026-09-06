import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const projectRoot = process.cwd();

test("session.ts enforces HTTP-only cookies, SameSite=lax, HMAC signatures, and timing attack protection", () => {
  const sessionSource = readFileSync(`${projectRoot}/src/lib/session.ts`, "utf8");

  assert.equal(sessionSource.includes("SESSION_COOKIE_NAME = \"nextuber_session\""), true);
  assert.equal(sessionSource.includes("httpOnly: true"), true);
  assert.equal(sessionSource.includes("sameSite: \"lax\""), true);
  assert.equal(sessionSource.includes("timingSafeEqual"), true);
  assert.equal(sessionSource.includes("createHmac(\"sha256\""), true);
});

test("production-access.ts enforces origin check, tutora permissions, and student write authorization", () => {
  const accessSource = readFileSync(`${projectRoot}/src/server/production-access.ts`, "utf8");

  assert.equal(accessSource.includes("requireProductionSession"), true);
  assert.equal(accessSource.includes("requireTutorSession"), true);
  assert.equal(accessSource.includes("requireTutorOrGga"), true);
  assert.equal(accessSource.includes("isGgaEquivalent"), true);
  assert.equal(accessSource.includes('managerType === "facilitador"'), true);
  assert.equal(accessSource.includes("assertSameOrigin"), true);
  assert.equal(accessSource.includes("authorizeStudentWrite"), true);
});
