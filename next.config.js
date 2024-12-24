/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '10mb'
      },
      responseLimit: false
    }
  }
};

module.exports = nextConfig;
