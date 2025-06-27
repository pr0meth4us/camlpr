// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:5328/api/:path*',
          },
        ]
      : [
          {
            source: '/api/:path*',
            destination: 'http://13.55.48.245:5328/api/:path*',
          },
        ];
  },
};

module.exports = nextConfig;
