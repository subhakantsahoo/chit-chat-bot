/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",  // Map RN to web for compatibility
    };

    return config;
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,             // Check for changes every second
      aggregateTimeout: 300,   // Delay before rebuilding
    };
    return config;
  }
};

export default nextConfig;
