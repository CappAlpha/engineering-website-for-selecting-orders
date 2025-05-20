/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.DOMAIN ?? "https://example.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_API_URL}/server-sitemap`],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/order"],
      },
    ],
  },
  exclude: ["/profile/*", "/api/*", "/order/*"],
};
