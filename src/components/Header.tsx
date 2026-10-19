"use client";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
export default function Header() {
  const path = usePathname();
  const nav = [
    ["/walkthrough/", "Walkthrough"],
    ["/problems/", "Common problems"],
  ];
  return (
    <header className="site-header">
      <a className="brand" href="/" rel="noreferrer">
        <span className="brand-icon">
          <Compass size={25} />
        </span>
        <span>
          India<span className="brand-sub">e-Visa companion</span>
        </span>
      </a>
      <nav aria-label="Main navigation">
        {nav.map(([url, title]) => (
          <a
            key={url}
            href={url}
            aria-current={
              path.startsWith(url.slice(0, -1)) ? "page" : undefined
            }
            rel="noreferrer"
          >
            {title}
          </a>
        ))}
      </nav>
    </header>
  );
}
