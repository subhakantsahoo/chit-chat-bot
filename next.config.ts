/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add React Native Web alias
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Add rule to handle react-native-image-picker's TypeScript files
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [/node_modules\/react-native-image-picker/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            'next/babel',
            '@babel/preset-typescript',
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
        },
      },
    });

    // Fix for fs module (if needed by other packages)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  // Add this to handle image files
  images: {
    domains: ['localhost'], // Add your domains here if needed
  },
};

export default nextConfig;