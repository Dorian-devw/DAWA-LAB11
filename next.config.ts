import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantienes localhost y agregas la IP de tu red local
  allowedDevOrigins: ["http://localhost:3000", "192.168.86.1"]
};

export default nextConfig;