/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*", // Proxy cho API
                destination: `${process.env.NEXT_PUBLIC_ENDPOINT_API}/:path*`, // URL của server Node.js
            }
        ];
    },
};

export default nextConfig;
