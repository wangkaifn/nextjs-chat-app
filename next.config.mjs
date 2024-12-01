import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzerConfig = {
  enabled: process.env.ANALYZE === "true",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@ant-design/pro-chat", "axios"],
    swcMinify: true,
  },
};

export default withBundleAnalyzer(analyzerConfig)(nextConfig);
