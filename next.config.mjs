import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzerConfig = {
  enabled: process.env.ANALYZE === "true",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default withBundleAnalyzer(analyzerConfig)(nextConfig);
