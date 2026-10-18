import type { Metadata } from "next";
import Header from "@/components/Header";
import { PORTAL } from "@/content/data";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "India e-Visa Companion · Prepare with peace of mind",
    template: "%s · India e-Visa Companion",
  },
  description:
    "Searchable help for the official India e-Visa form, with sourced field guidance and local photo and passport tools. No personal answers needed.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div>
            <strong>made with frustration ❤️</strong>
            <p>Independent companion · Not a government service</p>
          </div>
          <div>
            <a href="/privacy/" target="_blank" rel="noreferrer">
              Privacy
            </a>
            <a href={PORTAL} target="_blank" rel="noreferrer">
              Official portal ↗
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
