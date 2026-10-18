"use client";
import { useEffect } from "react";
import { fields } from "@/content/data";

export default function LegacyGuideRedirect() {
  useEffect(() => {
    const field = fields.find(
      (field) => `#${field.id}` === window.location.hash,
    );
    window.location.replace(field ? `/#${field.id}` : "/");
  }, []);
  return (
    <div className="page-width">
      <a href="/">Find a field on the home page →</a>
    </div>
  );
}
