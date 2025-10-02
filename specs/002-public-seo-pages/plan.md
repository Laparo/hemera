# Implementation Plan: 002-public-seo-pages

**Branch**: `002-public-seo-pages` | **Date**: 2025-10-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/002-public-seo-pages/spec.md`

> Note – Documentation Quality Gates apply. See repo CI for Markdown, spelling, and link checks.

## Summary

Deliver SEO-friendly public pages (landing, course list) using SSG/ISR with proper meta, Open Graph, structured data, and correctly configured sitemap/robots. Strict separation from non-public areas per Constitution Principle XI.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js (App Router), React 18, @mui/material  
**Storage**: N/A (or static/mock)  
**Identity**: N/A (public)  
**Testing**: Playwright (smoke), Lighthouse/SEO checks  
**Target Platform**: Vercel (SSG/ISR)  
**Project Type**: web (Next.js app)  
**Constraints**: Public only; SEO-critical; no leakage of private routes  
**Design System**: MUI (Material)

## Constitution Check

PASS (v1.7.0):

- Hybrid Rendering Policy: SSG/ISR for SEO; no SSR unless necessary.
- UI via MUI; accessibility focus maintained.
- Domain Segmentation: Public only; no private data/links.

## Rendering Strategy Matrix

| Route       | Strategy | Revalidate | Runtime | SEO Critical |
|-------------|----------|-----------:|---------|--------------|
| /           | SSG      |        300 | edge    | Yes          |
| /courses    | ISR      |        300 | edge    | Yes          |

Notes:

- Prefer `generateMetadata` for meta/OG; include JSON-LD where applicable.
- Ensure public routes are listed in sitemap; robots allows crawling for public only.

## Phase 0: Outline & Research

- Identify structured data types (WebSite, Course, BreadcrumbList) and mapping rules.
- Decide ISR revalidate values (target: 300s) and caching directives for fetch() if used.
- Define sitemap structure (static vs. generated) and ensure exclusion of non-public paths.
- Define robots policy for public: allow crawling for public, disallow sensitive areas by pattern.

## Phase 1: Design & Contracts

- No backend APIs planned. Define content shape (props) for landing and course list pages.
- Specify `generateMetadata` strategy per route (title, description, OG tags, JSON-LD snippets).
- Outline sitemap/robots generation (filenames, routes registry) and test cases (presence/absence of routes).

## Phase 2: Task Planning Approach

- Use tasks-template; generate tasks for SEO, sitemap/robots, metadata, tests.

## Branching & CI Gates

- Follow branch naming; docs gates enforce Markdown/spelling/links.
- Add Lighthouse/SEO check in PR description template as a manual gate (optional) until automated.

## Progress Tracking

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [x] Phase 2 tasks generated (see `/specs/002-public-seo-pages/tasks.md`)
- [ ] Implementation complete
- [ ] Validation passed
