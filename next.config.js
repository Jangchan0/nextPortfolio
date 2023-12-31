/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [`www.notion.so`, `images.unsplash.com`, 'prod-files-secure.s3.us-west-2.amazonaws.com'],
        format: ['image/png', 'image/webp', 'image/jpeg'],
    },
};

module.exports = nextConfig;
