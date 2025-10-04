/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://hemera.vercel.app',
  generateRobotsTxt: true,
  exclude: [
    '/auth/*',       // Authentication pages
    '/protected/*',  // Protected area
    '/api/auth/*',   // Auth API routes
    '/admin/*',      // Admin pages
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/protected/', '/api/auth/', '/admin/'],
      },
    ],
  },
  // Only include public routes in sitemap
  generateIndexSitemap: false,
}