# Playwright MCP — Status & Notes

Current status:

- Playwright tooling updated (devDependencies aligned to 1.55.1)
- Added `playwright` CLI as a devDependency so `npx playwright ...` is consistently available
- `.playwright-mcp/` is a working directory (empty, protected by .gitignore)

Usage:

- Run E2E locally: `npm run test:e2e` or `npm run e2e:dev`
- Install browsers (if needed): `npm run e2e:install`
- Report output: `playwright-report/` (gitignored)

Outlook:

- If a dedicated Playwright MCP server is desired, add an entry in `.vscode/mcp.json` similar to the
  other MCP servers
- Scripts/docs can be extended here (e.g., auth flow, test-data seeding, remote runs)
