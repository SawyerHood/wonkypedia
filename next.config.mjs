/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^cloudflare:sockets$/,
      })
    );

    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "sfozpnhknzamtdqmmjtl.supabase.co",
      },
      {
        hostname: "mynvsgmvogwjsrrm.public.blob.vercel-storage.com",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
