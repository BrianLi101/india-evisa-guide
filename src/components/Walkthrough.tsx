"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronDown } from "lucide-react";
import { fields, SAMPLE } from "@/content/data";
import { walkthroughPages, type WalkthroughField } from "@/content/walkthrough";
import FieldReference from "./FieldReference";
import { fieldGuideId } from "@/content/fieldHints";
import { OfficialLink } from "./ui";

function FieldRow({ item }: { item: WalkthroughField }) {
  // Inline dependent fields are rendered by the same component as their parent.
  if (item.fieldId && fieldGuideId(item.fieldId) !== item.fieldId) return null;
  const record = fields.find((field) => field.id === item.fieldId);
  const label = (
    <span>
      <span className="walkthrough-field-label">{item.label}</span>
      {item.when && <span className="walkthrough-condition">{item.when}</span>}
    </span>
  );
  if (!item.help) {
    return (
      <div
        id={item.id}
        className="walkthrough-field walkthrough-field-static"
        tabIndex={-1}
      >
        {label}
      </div>
    );
  }
  return (
    <details id={item.id} className="walkthrough-field">
      <summary>
        {label}
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="walkthrough-field-body">
        {record ? (
          <FieldReference embedded field={record} />
        ) : (
          <p>{item.hint}</p>
        )}
      </div>
    </details>
  );
}

function followAnchor(id: string) {
  const target = document.getElementById(fieldGuideId(id));
  if (!target) return;
  if (target.matches("details.walkthrough-field")) {
    (target as HTMLDetailsElement).open = true;
    target.querySelector("summary")?.focus({ preventScroll: true });
  } else if (target.matches(".walkthrough-field-static")) {
    target.focus({ preventScroll: true });
  } else if (target.matches(".walkthrough-section")) {
    target.querySelector("h2")?.focus({ preventScroll: true });
  } else return;
  target.scrollIntoView({ block: "start", behavior: "instant" });
}

export default function Walkthrough() {
  const [active, setActive] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(
      sectionsRef.current!.querySelectorAll<HTMLElement>(
        ".walkthrough-section",
      ),
    );
    let frame = 0;
    function updateActive() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const boundary =
          (navRef.current?.getBoundingClientRect().bottom ?? 0) + 64;
        let index = 0;
        sections.forEach((section, position) => {
          if (section.getBoundingClientRect().top <= boundary) index = position;
        });
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
        )
          index = sections.length - 1;
        setActive(index);
      });
    }
    function followHash() {
      followAnchor(window.location.hash.slice(1));
      updateActive();
    }
    followHash();
    const observer = new ResizeObserver(updateActive);
    observer.observe(sectionsRef.current!);
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", followHash);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", followHash);
    };
  }, []);

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
      return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`)
      window.history.pushState(null, "", `#${id}`);
    followAnchor(id);
  }

  return (
    <div className="walkthrough page-width">
      <header className="walkthrough-intro">
        <nav className="guide-mode-switch" aria-label="Guide mode">
          <a href="/">Search a field</a>
          <a href="/walkthrough/" aria-current="page">
            Walk through the form
          </a>
        </nav>
        <div className="walkthrough-title-row">
          <div>
            <h1>A little help, when you need it.</h1>
            <p>
              Follow the official form. Open a field only when you need
              guidance.
            </p>
          </div>
          <OfficialLink />
        </div>
        <details className="walkthrough-scope">
          <summary>About this guide · adult tourist e-Visa</summary>
          <p>
            The form through initial photo upload was checked on 18 October 2026
            using a synthetic U.S. tourist application. Later upload and payment
            guidance follows the{" "}
            <a href={SAMPLE} target="_blank" rel="noreferrer">
              official sample form ↗
            </a>
            . Other visa services and nationalities may show different fields.
          </p>
          <p>
            No answers are needed to use this guide. Optional text and
            selections stay in memory when you close a field or jump between
            sections, and clear on reload or leaving the walkthrough. Complete
            and submit your application only on the official portal.
          </p>
        </details>
      </header>
      <nav
        ref={navRef}
        className="walkthrough-steps"
        aria-label="Application steps"
      >
        <ol>
          {walkthroughPages.map((page, index) => (
            <li key={page.id}>
              <a
                href={`#page-${page.id}`}
                aria-label={`${index + 1}. ${page.title}`}
                aria-current={index === active ? "step" : undefined}
                onClick={(event) => jump(event, `page-${page.id}`)}
              >
                <span className="walkthrough-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="walkthrough-step-label" aria-hidden="true">
                  {page.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <p className="walkthrough-active-step">
          {walkthroughPages[active].title}
        </p>
      </nav>
      <div ref={sectionsRef} className="walkthrough-sections">
        {walkthroughPages.map((page) => (
          <section
            key={page.id}
            id={`page-${page.id}`}
            className="walkthrough-section"
            aria-labelledby={`heading-${page.id}`}
            data-walkthrough-page={page.id}
          >
            <header className="walkthrough-section-heading">
              <h2 id={`heading-${page.id}`} tabIndex={-1}>
                {page.title}
              </h2>
              {page.tool && (
                <a
                  className="walkthrough-tool"
                  href={page.tool.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {page.tool.label} ↗
                  <span className="sr-only"> (opens a new tab)</span>
                </a>
              )}
            </header>
            {page.groups.map((group) => (
              <section
                className={`walkthrough-group${group.provisional ? " walkthrough-group-provisional" : ""}`}
                key={group.fields[0]?.id ?? group.title}
                aria-label={group.title}
              >
                <h3>{group.title}</h3>
                {group.provisional && group.note && (
                  <p className="walkthrough-group-note">{group.note}</p>
                )}
                {group.fields.map((entry) => (
                  <FieldRow key={entry.id} item={entry} />
                ))}
              </section>
            ))}
            <details className="walkthrough-section-notes">
              <summary>On the official form &amp; sources</summary>
              <p>{page.nextAction}</p>
              <p>
                {page.portalTitle} ·{" "}
                {page.evidenceStatus === "LIVE_VERIFIED"
                  ? "Live observation · 18 October 2026"
                  : "Official sample · live layout unverified"}
              </p>
              <a href={page.source} target="_blank" rel="noreferrer">
                View section source ↗
              </a>
            </details>
          </section>
        ))}
      </div>
      <p className="walkthrough-privacy">
        Independent companion · Your application is completed on the official
        portal.
      </p>
    </div>
  );
}
