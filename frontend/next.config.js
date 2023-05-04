/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: 'asdasdasdasdasdasdasdasdasdasdaa',
    // SERVER_URL: 'https://social-api.up.railway.app',
    SERVER_URL: 'http://localhost:8080',
  },
};

module.exports = nextConfig;
