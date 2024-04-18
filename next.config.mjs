/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    experimental: {
        instrumentationHook: true,
    },
};

export default nextConfig;
