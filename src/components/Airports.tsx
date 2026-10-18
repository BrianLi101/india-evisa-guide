"use client";
import { useState } from "react";
import { Search, MapPin, ArrowUpRight } from "lucide-react";
import { locations, PORTAL } from "@/content/data";
import { matchesLocation } from "@/lib/locations";
export default function Airports() {
  const [query, setQuery] = useState("");
  const found = query.trim()
    ? [
        ...new Map(
          locations
            .filter(
              (l) =>
                l.liveDropdownLabels.length > 0 &&
                matchesLocation(query, [
                  l.canonicalName,
                  ...l.aliases,
                  l.airportCode ?? "",
                  l.region,
                  ...l.liveDropdownLabels.map((x) => x.label),
                ]),
            )
            .map((l) => [l.id, l]),
        ).values(),
      ]
    : [];
  return (
    <>
      <label className="search-box">
        <Search size={20} />
        <span className="sr-only">Search airport or city</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try Trivandrum, TRV, Bengaluru, or Kochi…"
        />
      </label>
      <p className="small muted">
        Indian cities can have more than one name: Trivandrum is
        Thiruvananthapuram, Bangalore is Bengaluru, and Cochin is Kochi. Search
        either name or the airport code.
      </p>
      <div className="location-list">
        {found.map((l) => (
          <article className="location-card" key={l.id}>
            <div className="location-name">
              <span className="location-icon">
                <MapPin size={24} />
              </span>
              <div>
                <h2>{l.canonicalName}</h2>
                <p>
                  {l.region} · {l.locationKind}
                </p>
              </div>
              {l.airportCode && <span className="iata">{l.airportCode}</span>}
            </div>
            <div className="location-detail">
              <div>
                <small>COMMON / ALTERNATE NAME</small>
                <p>{l.aliases.join(" · ") || "No additional name mapped"}</p>
                {l.aliasSources?.map((source, index) => (
                  <a
                    className="small"
                    key={source}
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Name / code source {index + 1} ↗{" "}
                  </a>
                ))}
              </div>
              <div>
                <small>LIVE FORM LABEL</small>
                {l.liveDropdownLabels.length
                  ? l.liveDropdownLabels.map((x) => (
                      <p key={x.label}>
                        <strong>{x.label}</strong>
                        <span className="small muted">
                          <a href={x.source} target="_blank" rel="noreferrer">
                            Source ↗
                          </a>
                        </span>
                      </p>
                    ))
                  : null}
              </div>
              <div>
                <small>ENTRY REQUIREMENTS</small>
                <a
                  className="small"
                  href={PORTAL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check authorized entry <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
            <div className="location-caveat">
              <p className="small muted">
                Verified At:{" "}
                <time dateTime={l.liveDropdownLabels[0].observedAt}>
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(
                    new Date(`${l.liveDropdownLabels[0].observedAt}T00:00:00Z`),
                  )}
                </time>
              </p>
            </div>
          </article>
        ))}
      </div>
      {query.trim() && !found.length && (
        <div className="empty-state">
          <h2>No match in the mapped arrival choices.</h2>
          <p>
            Try another city name or the three-letter airport code on your
            ticket.
          </p>
        </div>
      )}
    </>
  );
}
