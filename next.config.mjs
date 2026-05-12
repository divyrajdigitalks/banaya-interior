/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbopack: {
      resolveAlias: {
        fs: false,
        path: false,
        child_process: false,
        net: false,
        tls: false,
        worker_threads: false,
        canvas: false,
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        child_process: false,
        net: false,
        tls: false,
        worker_threads: false,
        canvas: false,
      };
    }
    return config;
  },
}

export default nextConfig
