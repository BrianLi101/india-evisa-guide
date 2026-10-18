"use client";
import { useState } from "react";
import { readDraft, deleteDraft, type EncryptedDraft } from "@/lib/draft";

export default function LegacyDraft() {
  const [draft, setDraft] = useState<EncryptedDraft>();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  async function check() {
    setBusy(true);
    try {
      const saved = await readDraft();
      setDraft(saved);
      setStatus(
        saved
          ? "An encrypted draft is available. Export a backup before deleting it."
          : "No saved draft found in this browser.",
      );
    } catch {
      setStatus(
        "Could not read browser storage. Your saved data has not been changed.",
      );
    } finally {
      setBusy(false);
    }
  }
  function download() {
    if (!draft) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "india-evisa-encrypted-draft.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function remove() {
    if (!draft) return;
    setBusy(true);
    try {
      await deleteDraft(draft.nonce);
      setDraft(undefined);
      setConfirm(false);
      setStatus(
        "Saved draft deleted. Downloaded backups have not been deleted.",
      );
    } catch {
      setStatus(
        "Could not delete the saved draft. Another tab may have changed it; check again before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="legacy-draft" aria-labelledby="legacy-heading">
      <h2 id="legacy-heading">Older saved draft?</h2>
      <p>
        If you used the former worksheet, you can export its encrypted backup or
        delete it. We do not unlock or display its answers here. Keep your
        original passphrase with your backup; this guide cannot import or
        decrypt it.
      </p>
      <button className="button" disabled={busy} onClick={() => void check()}>
        Check for an older draft
      </button>
      {draft && (
        <div className="home-start-actions">
          <button className="button" onClick={download} disabled={busy}>
            Export encrypted backup
          </button>
          <button
            className="text-button"
            onClick={() => setConfirm(true)}
            disabled={busy}
          >
            Delete saved draft
          </button>
        </div>
      )}
      {draft && confirm && (
        <div className="notice warning">
          <p>
            This permanently removes this browser’s saved draft. Export a backup
            first if you need it.
          </p>
          <button
            className="button"
            disabled={busy}
            onClick={() => void remove()}
          >
            Confirm delete saved draft
          </button>{" "}
          <button
            className="button"
            disabled={busy}
            onClick={() => setConfirm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <p role="status">{status}</p>
    </section>
  );
}
