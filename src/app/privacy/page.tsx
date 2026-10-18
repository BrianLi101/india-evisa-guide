import { PageIntro } from "@/components/ui";
export const metadata = { title: "Privacy & security" };
export default function Privacy() {
  return (
    <div className="page-width narrow">
      <PageIntro
        eyebrow="Your information, your device"
        title="Help without your personal answers."
        description="Look up a field here. Enter your answers on the official government portal."
      />
      <div className="prose">
        <h2>Search and guidance</h2>
        <p>
          We do not ask you to fill in an application here. Search runs locally
          in this tab against bundled guidance. Search text is not sent to a
          server, stored in browser storage, or added to the URL. Search for
          field names rather than personal details.
        </p>
        <h2>Interactive samples</h2>
        <p>
          Text entries, formatting previews and dropdown selections stay in this
          tab’s memory. They are not saved, sent, or added to the URL. Switching
          fields, reloading or leaving the page clears them. Formatting changes
          are applied only when you choose them. Copy buttons write the selected
          value to your device clipboard, where other apps and any enabled
          clipboard history or sync may retain it. Undo restores the field text;
          it does not clear the clipboard.
        </p>
        <h2>Optional file tools</h2>
        <p>
          Selected photos and documents are processed in this tab’s memory. They
          are never uploaded or saved by this site. Closing or refreshing the
          tab clears the active work. Downloads are ordinary, unencrypted files
          that you manage yourself.
        </p>
        <p>
          HEIC images may need an extra decoder, downloaded from this website.
          It runs on your device; the file is never sent with that download.{" "}
          <a href="/third-party/NOTICES.txt">Open-source notices</a>.
        </p>
        <h2>No account or tracking</h2>
        <p>
          There are no accounts, analytics, remote fonts, advertisements or
          third-party runtime scripts. The guide does not create saved
          application drafts or collect payment information.
        </p>
        <h2>Older encrypted drafts</h2>
        <p>
          If you used the former worksheet, its encrypted draft may still exist
          in this browser. We do not delete it automatically. The{" "}
          <a href="/worksheet/">older-draft page</a> lets you export the
          encrypted backup or explicitly delete it. Keep your original
          passphrase; the guide does not unlock, import or edit those answers.
          Downloaded backups remain wherever you saved them.
        </p>
        <h2>Website requests and external links</h2>
        <p>
          Your browser downloads static page assets. A hosting provider may
          retain ordinary request metadata such as IP address, user agent, time
          and page URL. Production pages block runtime network connections using
          a Content Security Policy. Opening the government portal is a separate
          visit governed by its own practices.
        </p>
        <h2>Device privacy</h2>
        <p>
          Local processing cannot protect against a compromised device, browser
          extension or someone viewing your screen. JavaScript cannot guarantee
          forensic erasure of all memory copies. Clearing a file here does not
          delete your downloads or files in other apps.
        </p>
        <h2>Independent by design</h2>
        <p>
          This project is not affiliated with the Government of India. It cannot
          submit an application, make a payment, determine eligibility or
          guarantee acceptance. Check current official instructions before
          applying.
        </p>
      </div>
    </div>
  );
}
