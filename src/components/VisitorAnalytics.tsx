"use client";

import { Analytics } from "@vercel/analytics/react";
import { visitorCountEvent } from "@/lib/analytics";

export default function VisitorAnalytics() {
  if (process.env.NEXT_PUBLIC_VISITOR_ANALYTICS !== "true") return null;

  return (
    <Analytics
      mode="production"
      debug={false}
      route="/"
      path="/"
      scriptSrc="/_vercel/insights/script.js"
      viewEndpoint="/_vercel/insights/view"
      beforeSend={visitorCountEvent}
    />
  );
}
