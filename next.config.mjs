/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'export', //gör att dynamic routing inte fungerar i profiles // Denna behövs dock för att kunna deploya appen.
    trailingSlash: true,
};

export default nextConfig;
