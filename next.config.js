/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // AWS Bedrockへの接続のためのAPI構成
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  publicRuntimeConfig: {
    apiEndpoint: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-url.vercel.app/api' 
      : 'http://localhost:3000/api',
  },
}