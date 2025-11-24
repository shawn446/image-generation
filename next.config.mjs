/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // REGISTER WASM AS A STATIC FILE TYPE
  webpack(config) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });
    return config;
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
