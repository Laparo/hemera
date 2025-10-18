# Contributing Guide

Thank you for contributing! Please follow these operational requirements in addition to code style
and tests.

## Operational Requirements

- Live-monitor Deploy workflows using the GitHub Actions VS Code extension (constitutional
  requirement):
  - Keep the run view open, follow logs until completion.
  - Verify final status and capture the deployment URL.
  - Review artifacts (e.g., Playwright report) when present.
- Branch hygiene after merge and successful production deploy:
  - Remove obsolete local and remote branches (keep `main`).
  - Document branch cleanup briefly in the PR or run notes.

## Development

- Follow the specs-first workflow under `specs/`.
- Ensure Quality Gates pass locally (lint, typecheck, build, tests) before opening a PR.
- Use Stripe in test mode only during development.

## Security

- Never commit secrets or real API keys.
- Use GitHub Secrets and environment management workflows.
