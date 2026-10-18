"use client";
import { useEffect, useState } from "react";
import { fields } from "@/content/data";
export default function LegacyFieldLink() {
  const [href, setHref] = useState("/");
  useEffect(() => {
    function update() {
      const field = fields.find((f) => `#${f.id}` === window.location.hash);
      setHref(field ? `/#${field.id}` : "/");
    }
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <a className="button primary" href={href}>
      Open field guidance →
    </a>
  );
}
