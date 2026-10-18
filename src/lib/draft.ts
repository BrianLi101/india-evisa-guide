import { fields, sections } from "../content/data";
import type { Answers } from "./schema";
export const KDF_ITERATIONS = 600_000;
export const DB_NAME = "evisa-private-draft";
export type DraftPayload = {
  version: 1;
  answers: Answers;
  transferred: string[];
};
export type EncryptedDraft = {
  version: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  cryptoAlgorithm: "AES-GCM";
  kdfAlgorithm: "PBKDF2";
  kdfParameters: { hash: "SHA-256"; iterations: number };
  salt: string;
  nonce: string;
  ciphertext: string;
};
export type DraftSession = {
  key: CryptoKey;
  salt: string;
  id: string;
  createdAt: string;
};
const encoder = new TextEncoder();
function base64(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
}
function decode(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}
function aad(
  draft: Omit<EncryptedDraft, "nonce" | "ciphertext">,
): Uint8Array<ArrayBuffer> {
  return encoder.encode(
    JSON.stringify([
      draft.version,
      draft.id,
      draft.createdAt,
      draft.updatedAt,
      draft.cryptoAlgorithm,
      draft.kdfAlgorithm,
      draft.kdfParameters.hash,
      draft.kdfParameters.iterations,
      draft.salt,
    ]),
  );
}
async function derive(passphrase: string, salt: string): Promise<CryptoKey> {
  const bytes = encoder.encode(passphrase);
  const material = await crypto.subtle.importKey(
    "raw",
    bytes,
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  bytes.fill(0);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: decode(salt),
      iterations: KDF_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
export async function newSession(passphrase: string): Promise<DraftSession> {
  if (passphrase.length < 12)
    throw new Error(
      "Use at least 12 characters. A longer, unique passphrase is better.",
    );
  const salt = base64(crypto.getRandomValues(new Uint8Array(16)));
  return {
    key: await derive(passphrase, salt),
    salt,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
export async function encryptDraft(
  payload: DraftPayload,
  session: DraftSession,
): Promise<EncryptedDraft> {
  const metadata: Omit<EncryptedDraft, "nonce" | "ciphertext"> = {
    version: 1,
    id: session.id,
    createdAt: session.createdAt,
    updatedAt: new Date().toISOString(),
    cryptoAlgorithm: "AES-GCM",
    kdfAlgorithm: "PBKDF2",
    kdfParameters: { hash: "SHA-256", iterations: KDF_ITERATIONS },
    salt: session.salt,
  };
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const bytes = encoder.encode(JSON.stringify(validatePayload(payload)));
  try {
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: nonce,
        additionalData: aad(metadata),
        tagLength: 128,
      },
      session.key,
      bytes,
    );
    return {
      ...metadata,
      nonce: base64(nonce),
      ciphertext: base64(new Uint8Array(ciphertext)),
    };
  } finally {
    bytes.fill(0);
  }
}
export function parseEnvelope(input: unknown): EncryptedDraft {
  if (!input || typeof input !== "object")
    throw new Error("Not a supported encrypted draft.");
  const d = input as Partial<EncryptedDraft>;
  if (
    d.version !== 1 ||
    d.cryptoAlgorithm !== "AES-GCM" ||
    d.kdfAlgorithm !== "PBKDF2" ||
    d.kdfParameters?.hash !== "SHA-256" ||
    d.kdfParameters.iterations !== KDF_ITERATIONS
  )
    throw new Error("Unsupported draft version or encryption settings.");
  for (const key of [
    "id",
    "createdAt",
    "updatedAt",
    "salt",
    "nonce",
    "ciphertext",
  ] as const)
    if (typeof d[key] !== "string") throw new Error("Invalid encrypted draft.");
  if (
    !/^[0-9a-f-]{36}$/.test(d.id!) ||
    d.createdAt!.length > 30 ||
    d.updatedAt!.length > 30 ||
    !Number.isFinite(Date.parse(d.createdAt!)) ||
    !Number.isFinite(Date.parse(d.updatedAt!))
  )
    throw new Error("Invalid draft metadata.");
  for (const value of [d.salt!, d.nonce!, d.ciphertext!])
    if (value.length > 2_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value))
      throw new Error("Invalid encrypted data.");
  if (
    decode(d.salt!).length !== 16 ||
    decode(d.nonce!).length !== 12 ||
    decode(d.ciphertext!).length < 16
  )
    throw new Error("Invalid encrypted data lengths.");
  // Whitelist the stored shape: imported extra properties cannot become plaintext storage.
  return {
    version: 1,
    id: d.id!,
    createdAt: d.createdAt!,
    updatedAt: d.updatedAt!,
    cryptoAlgorithm: "AES-GCM",
    kdfAlgorithm: "PBKDF2",
    kdfParameters: { hash: "SHA-256", iterations: KDF_ITERATIONS },
    salt: d.salt!,
    nonce: d.nonce!,
    ciphertext: d.ciphertext!,
  };
}
export function validatePayload(input: unknown): DraftPayload {
  if (!input || typeof input !== "object")
    throw new Error("Invalid draft content.");
  const p = input as Partial<DraftPayload>;
  if (
    p.version !== 1 ||
    !p.answers ||
    typeof p.answers !== "object" ||
    Array.isArray(p.answers) ||
    !Array.isArray(p.transferred)
  )
    throw new Error("Unsupported draft content.");
  const validIds = new Set(fields.map((f) => f.id));
  const answers: Answers = {};
  if (Object.keys(p.answers).length > fields.length)
    throw new Error("Invalid draft fields.");
  for (const [id, value] of Object.entries(p.answers)) {
    if (!validIds.has(id) || typeof value !== "string" || value.length > 10_000)
      throw new Error("Invalid draft field.");
    answers[id] = value;
  }
  if (
    p.transferred.some(
      (id) => typeof id !== "string" || !sections.some((s) => s.id === id),
    )
  )
    throw new Error("Invalid draft progress.");
  return { version: 1, answers, transferred: [...new Set(p.transferred)] };
}
export async function unlockDraft(
  input: unknown,
  passphrase: string,
): Promise<{ payload: DraftPayload; session: DraftSession }> {
  const draft = parseEnvelope(input);
  const key = await derive(passphrase, draft.salt);
  let plain: ArrayBuffer;
  try {
    plain = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decode(draft.nonce),
        additionalData: aad(draft),
        tagLength: 128,
      },
      key,
      decode(draft.ciphertext),
    );
  } catch {
    throw new Error(
      "Could not unlock. The passphrase is incorrect or the file has been changed.",
    );
  }
  try {
    return {
      payload: validatePayload(JSON.parse(new TextDecoder().decode(plain))),
      session: {
        key,
        salt: draft.salt,
        id: draft.id,
        createdAt: draft.createdAt,
      },
    };
  } finally {
    new Uint8Array(plain).fill(0);
  }
}
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new Error(
          "Browser storage is unavailable. You can keep working in this session.",
        ),
      );
    request.onblocked = () =>
      reject(
        new Error("Close other companion tabs before changing local storage."),
      );
  });
}
export async function readDraft(): Promise<EncryptedDraft | undefined> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("drafts", "readonly");
      const request = tx.objectStore("drafts").get("active");
      request.onsuccess = () => {
        try {
          resolve(request.result ? parseEnvelope(request.result) : undefined);
        } catch (e) {
          reject(e);
        }
      };
      request.onerror = () =>
        reject(new Error("Could not read the saved draft."));
    });
  } finally {
    db.close();
  }
}
export async function writeDraft(
  draft: EncryptedDraft,
  expectedNonce: string | null,
): Promise<void> {
  const safe = parseEnvelope(draft);
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("drafts", "readwrite");
      const store = tx.objectStore("drafts");
      const prior = store.get("active");
      let conflict = false;
      prior.onsuccess = () => {
        if ((prior.result?.nonce ?? null) !== expectedNonce) {
          conflict = true;
          tx.abort();
          return;
        }
        store.put(safe, "active");
      };
      tx.oncomplete = () => resolve();
      tx.onabort = tx.onerror = () =>
        reject(
          new Error(
            conflict
              ? "This draft changed in another tab. Export a backup, then reload before saving again."
              : "Encrypted save failed. Keep this tab open and export your encrypted draft.",
          ),
        );
    });
  } finally {
    db.close();
  }
}
export async function deleteDraft(expectedNonce: string | null): Promise<void> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("drafts", "readwrite");
      const store = tx.objectStore("drafts");
      const prior = store.get("active");
      prior.onsuccess = () => {
        if ((prior.result?.nonce ?? null) !== expectedNonce) {
          tx.abort();
          return;
        }
        store.clear();
      };
      tx.oncomplete = () => resolve();
      tx.onabort = tx.onerror = () =>
        reject(
          new Error(
            "Could not delete the draft; another tab may have changed it. Export your current work, close other tabs and reload.",
          ),
        );
    });
  } finally {
    db.close();
  }
}
