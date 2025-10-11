# Research: 002-public-seo-pages

## Decisions

- Rendering: `/` SSG, `/courses` ISR (revalidate 300s)
- Metadata: `generateMetadata` per route; OG tags; JSON-LD for WebSite/Course where applicable
- Sitemap/robots: Public routes only; exclude non-public paths

## Rationale

- SSG/ISR maximizes SEO and performance for public content
- Structured data improves search visibility and rich results

## Alternatives Considered

- Server-side rendering (SSR): rejected for public pages to reduce TTFB and cost
- Client-side-only metadata: rejected due to SEO limitations

## Perplexity Research Insights

### SEO Best Practices for Next.js

- Query Perplexity: "Latest SEO techniques for Next.js 14 with App Router"
- Key insights: [To be filled with MCP query results]

### Structured Data Implementation

- Query Perplexity: "Best practices for JSON-LD structured data in educational websites"
- Key insights: [To be filled with MCP query results]

### Performance Optimization

- Query Perplexity: "Optimizing ISR and SSG for better Core Web Vitals"
- Key insights: [To be filled with MCP query results]
