// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',      // Original path
          destination: '/home',  // Redirected path
          permanent: true,  
        },
      ];
    },
  };
  
  export default nextConfig;
  