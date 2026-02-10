import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "stockx-assets.com",
            },
            {
                protocol: "https",
                hostname: "image.goat.com",
            },
            {
                protocol: "https",
                hostname: "images.stockx.com",
            }
        ],
    },
};

export default nextConfig;
