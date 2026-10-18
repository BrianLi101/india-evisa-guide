import { SourceNote } from "./ui";

export default function PassportRequirements() {
  return (
    <details className="passport-requirements quiet-disclosure">
      <summary>See website requirements</summary>
      <ul>
        <li>
          <strong>Format:</strong> PDF.
        </li>
        <li>
          <strong>Size:</strong> at least 10 KB, no more than 300 KB.
        </li>
        <li>
          Include the passport page with your photograph and personal details:
          name, date of birth, nationality and expiry date.
        </li>
        <li>
          Use the same passport you entered in the application’s Passport
          Details section.
        </li>
        <li>
          All documents must be in English, including business cards and
          invitation letters when required.
        </li>
        <li>
          Unclear documents or files that do not meet these requirements may
          lead to rejection of the application.
        </li>
      </ul>
      <SourceNote sample />
    </details>
  );
}
