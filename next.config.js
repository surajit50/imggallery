/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["res.cloudinary.com", "api.cloudinary.com"],

    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
