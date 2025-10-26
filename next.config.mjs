import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Disable filesystem cache to prevent serialization issues
      config.cache = false;

      // Optimize chunk splitting to reduce bundle sizes
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
  async redirects() {
    // Backward compatibility: consolidate protected routes
    // All legacy /protected/* paths should land on the client-guarded dashboard
    return [
      {
        source: '/protected/:path*',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
