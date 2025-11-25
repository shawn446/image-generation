/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['@resvg/resvg-js'],
  },
  async rewrites() {
    return [
      {
        source: "/api/ring/:score.png",
        destination: "/api/ring/:score",
      },
    ];
  },
};
export default nextConfig;
