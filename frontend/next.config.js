/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Backend dev server (http)
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
      // Backend dev server (https, if proxied)
      { protocol: 'https', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
      // Allow any hostname for production deployments (same origin or custom domain)
      { protocol: 'http', hostname: '**', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**', pathname: '/uploads/**' },
    ],
  },
};

module.exports = nextConfig;
