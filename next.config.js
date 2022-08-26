/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ["components", "lib", "pages", "types"],
  },
  i18n: {
    locales: ["cs"],
    defaultLocale: "cs",
  },
  experimental: {
    scrollRestoration: true,
    // runtime: "experimental-edge",
  },
};

module.exports = nextConfig;
