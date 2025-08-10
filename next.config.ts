/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,              // <<< ปิด Optimizer ของ Vercel ชั่วคราว
    domains: [
      "vfxquwgmyPDRGtdajuzy.supabase.co", // โดเมน Supabase ของคุณ
    ],
  },
};
export default nextConfig;