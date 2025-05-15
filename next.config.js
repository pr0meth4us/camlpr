// next.config.js
/** @type {import('next').NextConfig} */
const BACKEND_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:5328/api'
        : 'https://apparent-nadeen-aupp-54d2fac0.koyeb.app/api';

const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${BACKEND_URL}/:path*`,
    },
  ],
};

module.exports = nextConfig;
