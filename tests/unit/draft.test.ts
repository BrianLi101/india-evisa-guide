import { describe, it, expect } from "vitest";
import {
  encryptDraft,
  newSession,
  parseEnvelope,
  unlockDraft,
  validatePayload,
  KDF_ITERATIONS,
  type DraftPayload,
} from "../../src/lib/draft";
const password = "synthetic-test-passphrase-123";
const payload: DraftPayload = {
  version: 1,
  answers: {
    givenNames: "Nora Synthetic",
    passportNumber: "SYNTHETIC-PRIVATE-7284",
    employer: "Example, Inc.",
  },
  transferred: [],
};
describe("authenticated encrypted drafts", () => {
  it("round trips exact text and generates unique nonces", async () => {
    const session = await newSession(password);
    expect(session.key.extractable).toBe(false);
    const first = await encryptDraft(payload, session);
    const second = await encryptDraft(payload, session);
    expect(first.nonce).not.toBe(second.nonce);
    expect(first.ciphertext).not.toBe(second.ciphertext);
    expect(first.kdfParameters.iterations).toBe(KDF_ITERATIONS);
    expect(JSON.stringify(first)).not.toContain("SYNTHETIC-PRIVATE");
    expect((await unlockDraft(first, password)).payload).toEqual(payload);
  });
  it("fails closed on a wrong password, ciphertext and authenticated metadata tampering", async () => {
    const d = await encryptDraft(payload, await newSession(password));
    await expect(unlockDraft(d, "wrong-test-password")).rejects.toThrow(
      /Could not unlock/,
    );
    await expect(
      unlockDraft({ ...d, updatedAt: "2026-01-01T00:00:00.000Z" }, password),
    ).rejects.toThrow(/Could not unlock/);
    const changed =
      (d.ciphertext[0] === "A" ? "B" : "A") + d.ciphertext.slice(1);
    await expect(
      unlockDraft({ ...d, ciphertext: changed }, password),
    ).rejects.toThrow(/Could not unlock/);
  });
  it("rejects expensive KDF parameters before derivation and strips extra metadata", async () => {
    const d = await encryptDraft(payload, await newSession(password));
    expect(() =>
      parseEnvelope({
        ...d,
        kdfParameters: { hash: "SHA-256", iterations: 10 ** 12 },
      }),
    ).toThrow(/Unsupported/);
    expect(
      parseEnvelope({ ...d, plaintext: "never store this" }),
    ).not.toHaveProperty("plaintext");
    expect(() => parseEnvelope({ ...d, nonce: "AA==" })).toThrow();
  });
  it("rejects malformed payloads, prototype keys and oversized answers", () => {
    expect(() =>
      validatePayload({
        version: 1,
        answers: { unknown: "x" },
        transferred: [],
      }),
    ).toThrow();
    expect(() =>
      validatePayload({
        version: 1,
        answers: { givenNames: "a".repeat(10001) },
        transferred: [],
      }),
    ).toThrow();
    expect(() =>
      validatePayload(
        JSON.parse(
          '{"version":1,"answers":{"__proto__":"x"},"transferred":[]}',
        ),
      ),
    ).toThrow();
    expect(() =>
      validatePayload({ ...payload, transferred: ["fake-step"] }),
    ).toThrow();
  });
  it("requires a substantial passphrase for new drafts", async () => {
    await expect(newSession("short")).rejects.toThrow(/12 characters/);
  });
});
