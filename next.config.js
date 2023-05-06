/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: [
      "images.unsplash.com"
    ]
  } 
}

module.exports = nextConfig
