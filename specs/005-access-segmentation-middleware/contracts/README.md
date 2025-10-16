# Contracts: 005 — Access Segmentation Middleware

This directory contains contract test specifications and optional mock definitions for access
segmentation. Goal: Clear, testable expectations for redirects, HTTP status codes, and SEO
headers/meta.

## Target Contracts

- Protected Redirect Contract
  - Unauthenticated page request → 302 to `/sign-in?redirect_url=<encoded>`
  - Authenticated page request → 200 + `X-Robots-Tag: noindex, nofollow` + meta robots
- API Unauthorized Contract
  - Unauthenticated API request → `401` with concise JSON error body
- Admin API Contract (Follow-up)
  - Admin endpoints under `/api/admin/*` return 403 for non-admins, 200 for admins
