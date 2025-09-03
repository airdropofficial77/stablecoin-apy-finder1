/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❌ Ignore linting errors during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
