"use client";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { issues } from "@/content/data";
import { normalizeSearch } from "@/lib/search";
import ProblemAnswer from "./ProblemAnswer";

export default function ProblemLibrary() {
  const [query, setQuery] = useState("");
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const matches = issues.filter((issue) => {
    const terms = normalizeSearch(
      `${issue.title} ${issue.answer} ${issue.answerBullets?.join(" ") ?? ""} ${issue.symptoms}`,
    );
    return words.every((word) => terms.includes(word));
  });
  return (
    <>
      <label className="search-box">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Search common problems</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          autoComplete="off"
        />
      </label>
      <p className="small muted" role="status">
        {matches.length} question{matches.length !== 1 ? "s" : ""}
      </p>
      <div className="faq-list">
        {matches.map((issue) => (
          <details className="faq-item" key={issue.id} id={issue.id}>
            <summary>
              <h2>{issue.title}</h2>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="faq-content">
              <ProblemAnswer issue={issue} />
            </div>
          </details>
        ))}
      </div>
      {!matches.length && (
        <p className="empty-state">
          No matching questions. Try another word or phrase.
        </p>
      )}
    </>
  );
}
