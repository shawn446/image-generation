/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        // Allow URLs like /api/ring/80.png → handled by /api/ring/[score]
        source: "/api/ring/:score.png",
        destination: "/api/ring/:score",
      },
    ];
  },
};

export default nextConfig;
