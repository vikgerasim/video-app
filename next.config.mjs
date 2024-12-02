/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'example.com'
        },
        {
          protocol: 'https',
          hostname: 'i.ytimg.com'
        }
      ]
    }
  };
  
  export default nextConfig;