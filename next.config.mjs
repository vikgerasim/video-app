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
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos'
        },
        {
          protocol: 'https',
          hostname: 'i.vimeocdn.com'
        }
      ]
    }
  };
  
  export default nextConfig;