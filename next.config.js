/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ui/Login',
        permanent: true, // Use `false` if this is a temporary redirect
      },
    ];
  },
};

module.exports = nextConfig;
