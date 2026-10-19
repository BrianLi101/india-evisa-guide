"use client";
import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { searchGuides } from "@/lib/search";
import { fields } from "@/content/data";
import { fieldGuideId } from "@/content/fieldHints";
import { portalObservations } from "@/content/portalObservations";
import FieldReference from "./FieldReference";
export default function Search({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const selectedRef = useRef<HTMLDivElement>(null);
  const selectedField = fields.find(
    (field) => field.id === fieldGuideId(selectedId),
  );

  useEffect(() => {
    function readFieldLink() {
      const field = fields.find(
        (field) => `#${field.id}` === window.location.hash,
      );
      setSelectedId(field?.id ?? "");
      setQuery(
        field
          ? (portalObservations[field.id]?.label ?? field.officialLabel)
          : "",
      );
    }
    readFieldLink();
    window.addEventListener("hashchange", readFieldLink);
    window.addEventListener("popstate", readFieldLink);
    return () => {
      window.removeEventListener("hashchange", readFieldLink);
      window.removeEventListener("popstate", readFieldLink);
    };
  }, []);

  function selectField(id: string, title: string) {
    setSelectedId(id);
    setQuery(title);
    window.history.pushState(null, "", `/#${id}`);
  }

  useEffect(() => {
    if (selectedId) selectedRef.current?.focus({ preventScroll: true });
  }, [selectedId]);

  const matches = searchGuides(query);
  const shown = expanded ? matches : matches.slice(0, 8);
  return (
    <div className={`search-wrap ${compact ? "compact" : ""}`}>
      <label className="search-box">
        <SearchIcon size={20} />
        <span className="sr-only">Search fields and common problems</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setExpanded(false);
            setSelectedId("");
            if (window.location.hash)
              window.history.replaceState(null, "", "/");
          }}
          placeholder="Search a field, e.g. Religion"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="search-privacy"
        />
      </label>
      <p className="small muted search-hint" id="search-privacy">
        Field names only. Search stays on your device.
      </p>
      {query.trim() && !selectedField && (
        <div className="search-results" aria-label="Search results">
          <p className="small" role="status">
            {matches.length
              ? `${matches.length} matching guides${matches.length > shown.length ? ` · showing ${shown.length}` : ""}`
              : "No matches. Try “religion”, “passport”, or “employer”, or “national ID”."}
          </p>
          {shown.map((r) => (
            <a
              key={r.url}
              href={r.url}
              onClick={(event) => {
                if (
                  r.url.startsWith("/#") &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                ) {
                  event.preventDefault();
                  selectField(r.url.slice(2), r.title);
                }
              }}
            >
              <span>
                <small>{r.kind}</small>
                {r.title}
                <span className="search-section">{r.section}</span>
              </span>
              <ArrowRight size={16} />
            </a>
          ))}
          {matches.length > shown.length && (
            <button className="text-button" onClick={() => setExpanded(true)}>
              Show all {matches.length} results
            </button>
          )}
        </div>
      )}
      {selectedField && (
        <div
          className="selected-field field-reference"
          ref={selectedRef}
          tabIndex={-1}
          aria-label="Selected field"
        >
          <FieldReference key={selectedId} field={selectedField} />
        </div>
      )}
    </div>
  );
}
