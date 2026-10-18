"use client";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { issues } from "@/content/data";
import { Evidence } from "./ui";
export default function ProblemLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const matches = issues.filter(
    (i) =>
      (filter === "all" || i.evidenceStatus === filter) &&
      `${i.title} ${i.symptoms} ${i.workaround}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <label className="search-box">
        <Search size={19} />
        <span className="sr-only">Search common problems</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symptoms, fields, or a question…"
        />
      </label>
      <details className="quiet-disclosure problem-filters">
        <summary>Filter by source</summary>
        <div className="filter-row" aria-label="Filter by evidence">
          {[
            ["all", "All guidance"],
            ["OFFICIAL", "Official sources"],
            ["LIVE_VERIFIED", "Live checked"],
            ["REPORTED", "Reported issues"],
          ].map(([v, l]) => (
            <button
              key={v}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </details>
      <p className="small muted" role="status">
        {matches.length} guide{matches.length !== 1 ? "s" : ""}
      </p>
      <div className="problems-grid">
        {matches.map((i) => (
          <a className="problem-card" key={i.id} href={`/problems/${i.id}/`}>
            <Evidence status={i.evidenceStatus} />
            <h2>{i.title}</h2>
            <ArrowRight size={16} />
          </a>
        ))}
      </div>
      {!matches.length && (
        <p className="empty-state">
          No matching guides. Try a different phrase or evidence filter.
        </p>
      )}
    </>
  );
}
