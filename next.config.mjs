/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    experimental: {
        instrumentationHook: true,
    },
};

export default nextConfig;
