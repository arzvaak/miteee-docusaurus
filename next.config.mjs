const dockerBuild = process.env.NEXT_DOCKER_BUILD === "1";
const authTraceExcludes = [
  "./.github/**/*",
  "./app/**/*",
  "./components/**/*",
  "./data/**/*",
  "./deploy-artifacts/**/*",
  "./docker/**/*",
  "./docs/**/*",
  "./lib/**/*",
  "./ops/**/*",
  "./output/**/*",
  "./public/**/*",
  "./scripts/**/*",
  "./src/**/*",
  "./tests/**/*",
  "./*.md",
  "./*.py",
  "./*.ts",
  "./*.mjs",
  "./*.sh",
  "./*.yml",
  "./*.yaml",
  "./package-lock.json",
  "./requirements*.txt",
  "./tsconfig*.json"
];
const authTraceIncludes = [
  "./node_modules/better-sqlite3/**/*",
  "./node_modules/bindings/**/*",
  "./node_modules/file-uri-to-path/**/*"
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingExcludes: {
    "/api/auth/*": authTraceExcludes,
    "/api/deeptutor": authTraceExcludes,
    "/api/deeptutor/*": authTraceExcludes,
    "/login": authTraceExcludes,
    "/register": authTraceExcludes,
    "/account": authTraceExcludes
  },
  outputFileTracingIncludes: {
    "/api/auth/*": authTraceIncludes,
    "/api/deeptutor": authTraceIncludes,
    "/api/deeptutor/*": authTraceIncludes,
    "/login": authTraceIncludes,
    "/register": authTraceIncludes,
    "/account": authTraceIncludes
  },
  experimental: dockerBuild
    ? {
        cpus: 1,
        workerThreads: false,
        staticGenerationMaxConcurrency: 1,
        staticGenerationMinPagesPerWorker: 1000
      }
    : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
