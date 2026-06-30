const dockerBuild = process.env.NEXT_DOCKER_BUILD === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  output: "standalone",
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
