module.exports = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'  // Flask runs on port 5328
            : '/api/',  // Change this if deploying
      },
    ]
  },
}
