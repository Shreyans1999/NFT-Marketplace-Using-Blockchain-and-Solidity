/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["shreyansmarketplace.infura-ipfs.io", "infura-ipfs.io"],
  },
};
module.exports = nextConfig;
