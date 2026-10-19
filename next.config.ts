import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VISITOR_ANALYTICS:
      process.env.NEXT_PUBLIC_VISITOR_ANALYTICS ??
      (process.env.VERCEL_ENV === "production" ? "true" : "false"),
  },
};
export default config;
