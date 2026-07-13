/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ Next.js <Image> দিয়ে Cloudinary ইমেজ লোড করতে hostname allowlist
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
