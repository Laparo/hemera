# Hemera Constitution

## Core Principles

### I. Specs-First Development (NON-NEGOTIABLE)

All features must be fully specified in `specs/<###-slug>/spec.md` before any implementation begins. No code changes are permitted without approved tasks generated from complete specifications. The workflow is: Specify → Plan → Generate Tasks → Implement.

### II. Quality Gates Enforcement

Every pull request must pass all automated quality checks without exception:
- **Markdown linting**: `.markdownlint.jsonc` configuration enforced
- **Spell checking**: `cspell` with German/English dictionary support
- **Link validation**: `lychee` ensures all documentation links are valid
- **Code linting**: ESLint for TypeScript/JavaScript with zero tolerance policy
- **Accessibility testing**: Automated a11y checks for all UI components
- **End-to-End testing**: Playwright tests must cover critical user paths

### III. Git Workflow Discipline

All commits must pass pre-commit hooks enforced by `husky` and `lint-staged`:
- Automatic code formatting and linting on staged files
- Spell check validation on documentation changes
- No direct commits to `main` branch - all changes via Pull Requests
- Squash merging to maintain clean git history

### IV. Test-Driven Development

Testing requirements are mandatory and non-negotiable:
- **Unit tests**: All business logic must have comprehensive test coverage
- **Integration tests**: Database interactions and API endpoints must be tested
- **E2E tests**: Critical user journeys must be covered by Playwright
- **Accessibility tests**: All UI components must pass WCAG compliance tests
- **Performance tests**: Lighthouse CI ensures performance standards

### V. Documentation Standards

All documentation must be maintainable and validated:
- **Dictionary consistency**: `cspell.words.txt` maintains approved terminology
- **German/English support**: Bilingual documentation when appropriate
- **Link integrity**: All internal and external links must be validated
- **Markdown compliance**: Consistent formatting enforced by markdownlint

## Development Workflow

### Pre-commit Enforcement

The following tools are configured via `husky` and `lint-staged`:

```bash
# Automatically run on git commit
- ESLint (--fix) on *.ts, *.tsx, *.js, *.jsx
- Prettier formatting on all staged files
- cspell on *.md, *.mdx files
- markdownlint on *.md files
```

### CI/CD Pipeline Requirements

All workflows in `.github/workflows/` must pass:
- **docs-cspell**: Spell checking with dictionary validation
- **docs-markdownlint**: Markdown formatting compliance
- **docs-link-check**: Link validation across all documentation
- **eslint**: Code quality and style enforcement
- **e2e**: End-to-end testing with Playwright
- **lighthouse-ci**: Performance and accessibility auditing

### Testing Infrastructure

- **Unit/Integration**: Jest with comprehensive coverage requirements
- **E2E Testing**: Playwright with cross-browser support
- **A11y Testing**: Automated accessibility checks using axe-core
- **Performance**: Lighthouse CI with predefined thresholds
- **Database**: SQLite for CI, PostgreSQL for production

## Technology Stack Standards

### Core Technologies

- **Frontend**: Next.js (App Router) with TypeScript
- **UI Library**: Material-UI (MUI) with Material Design principles
- **Database**: Vercel Postgres (Neon) with Prisma ORM
- **Authentication**: Clerk (installed as Vercel integration)
- **Repository**: GitHub (repository service for source control, issues, and pull requests)
- **Testing**: Playwright (E2E), Jest (Unit), axe-core (A11y)
- **Hosting/Deployment**: Vercel (deployments are executed by GitHub Actions via Vercel CLI; Vercel Git integration is disabled)

### Quality Assurance Tools

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent configuration
- **Spell Check**: cspell with custom dictionary support
- **Link Validation**: lychee for documentation integrity
- **Git Hooks**: husky + lint-staged for pre-commit validation

## Accessibility Requirements

### WCAG Compliance

All UI components must meet WCAG 2.1 AA standards:
- Automated testing via axe-core in Playwright tests
- Color contrast ratios must meet minimum requirements
- Keyboard navigation support for all interactive elements
- Screen reader compatibility validation

### Testing Implementation

```typescript
// Example A11y test requirement
test('should be accessible', async ({ page }) => {
  await page.goto('/component-under-test');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Repository Management

This project uses GitHub as the repository service for source control, issues, and pull requests. The following rules are mandatory:

### Branching and Protections

- Default branch: `main`
- No direct commits to `main`; all changes via Pull Requests
- Protected branch rules on `main`:
  - Require pull request reviews: minimum 1 approval
  - Require status checks to pass before merging (all CI workflows)
  - Require up-to-date branch with base before merging
  - Dismiss stale reviews on new commits
  - Enforce linear history (squash merge only)

### Pull Requests

- PR title follows Conventional Commits or a clear, scoped description
- Link related issues using GitHub keywords (fixes/closes #NN)
- Include checklist confirming: tests updated, docs updated, CI green
- Draft PRs are encouraged early; convert to Ready for Review when complete

### Issues

All work is tracked via GitHub Issues. The following rules apply:

- Use the provided templates for new issues:
  - Bug Reports: `.github/ISSUE_TEMPLATE/bug_report.md`
  - Feature Requests: `.github/ISSUE_TEMPLATE/feature_request.md`
- Blank issues are disabled via `.github/ISSUE_TEMPLATE/config.yml`.
- Each issue must include clear acceptance criteria and, for bugs, reproducible steps and expected vs. actual behavior.
- Label every issue on creation (at minimum `type:*` and `status:*`; add `priority:*` when relevant).
- Triage SLA: New issues are triaged within 24 hours and moved to an actionable state (`status:ready`) or marked `status:blocked` with a blocking reason.
- Automation:
  - Labels are defined in `.github/labels.yml` and synchronized by the workflow `Labels - Sync`.
  - New issues are auto-labeled by `Issues - Triage` with `status:triage`. Issue titles starting with `vercel:` are additionally labeled as `type:bug`.
  - The Vercel → GitHub Issues integration may create issues automatically for deployment/runtime incidents; these follow the same triage/labeling rules.
  - Optionally, CI may open an issue on failed deployments when the repository variable `CI_CREATE_ISSUES=true` is set.
- Link issues to pull requests using GitHub keywords (e.g., `closes #123`) and keep status/labels in sync with progress.

### Labels and Project Hygiene

- Labels are defined in `.github/labels.yml` and kept in sync by the `Labels - Sync` workflow.
- Standard labels: `type:feature`, `type:bug`, `type:chore`, `priority:high/medium/low`, `status:triage/blocked/ready`
- Use `good first issue` and `help wanted` for community tasks
- Keep issues scoped and actionable with acceptance criteria

### CI/CD and Environments

- GitHub Actions required checks: `eslint`, `docs-markdownlint`, `docs-cspell`, `docs-link-check`, `e2e`, `lighthouse-ci`, `deploy - vercel`
- Environments: `preview` (PRs), `production` (main)
- Required reviewers for protected environments where applicable

Deployments are orchestrated exclusively by GitHub Actions using the Vercel CLI. The native Vercel GitHub integration for auto-deploys is disabled to prevent duplicate deployments and to keep CI results as the single source of truth.

### Security and Compliance

- Branch protection prevents force-push and deletion of `main`
- Secret management via Vercel/Clerk/GitHub Actions secrets (no secrets in repo)
- Dependabot or equivalent for security updates is recommended

## Governance

### Constitution Authority

This Constitution supersedes all other development practices and must be consulted for all technical decisions. No exceptions are permitted without explicit documentation and approval process.

### Amendment Process

Changes to this Constitution require:
1. Documentation of rationale and impact assessment
2. Review by all active contributors
3. Migration plan for existing code/processes
4. Version update with changelog

### Compliance Verification

All pull requests must demonstrate compliance with these principles. Reviewers are required to verify adherence to quality gates and development standards before approval.

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
