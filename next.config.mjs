/** @type {import('next').NextConfig} */
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    prependData: '@use "~@/styles/_mixins.scss" as *;',
  },
  images: {
    // Домены картинок для Image
    remotePatterns: [
      // {
      //   protocol: `${process.env.NEXT_PUBLIC_IMG_PROTOCOL ?? ''}`,
      //   hostname: `${process.env.NEXT_PUBLIC_IMG_HOST ?? ''}`,
      //   port: `${process.env.NEXT_PUBLIC_IMG_PORT ?? ''}`,
      // },
      // {
      //   protocol: `${process.env.NEXT_PUBLIC_IMG_STRAPI_PROTOCOL ?? ''}`,
      //   hostname: `${process.env.NEXT_PUBLIC_IMG_STRAPI_HOST ?? ''}`,
      //   port: `${process.env.NEXT_PUBLIC_IMG_STRAPI_PORT ?? ''}`,
      // },
    ],
    deviceSizes: [360, 768, 1024, 1280, 1440, 1600],
    minimumCacheTTL: 7200,
  },
  webpack(config) {
    // config.plugins.push(new BundleAnalyzerPlugin());
    // Grab the existing rule that handles SVG imports
    // @ts-ignore - rules is a private property that is not typed
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
