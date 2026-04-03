/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Directory is now stable in Next.js 14, no need for experimental flag
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
