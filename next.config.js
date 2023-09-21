/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["cdn.discordapp.com"] },
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    staticFolder: "/public",
  },
};

module.exports = nextConfig;
