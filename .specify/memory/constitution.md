# Hemera Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)
TDD is mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. All features must have comprehensive test coverage before implementation.

### II. Quality Gates
Every pull request must pass all automated quality checks including:
- TypeScript compilation without errors
- ESLint linting without warnings
- Automated test suite (unit, integration, e2e)
- **Qodo PR Agent analysis and approval**
- Documentation completeness verification

### III. Specs-First Workflow
Every feature starts with a complete specification in `specs/`. Implementation begins only after tasks are generated and approved. No code changes without corresponding spec documentation.

### IV. Authentication & Security
- Production-grade authentication required (Clerk implementation)
- Environment variables must be properly configured
- Security best practices enforced in all components
- Protected routes must implement proper authorization

### V. Performance & SEO
- Core Web Vitals compliance required
- SEO optimization for all public pages
- Lighthouse scores >= 90 for production pages
- Static generation where applicable

## Development Workflow

### Pull Request Requirements
All pull requests MUST satisfy these requirements before merge:

1. **Automated Tests**: All tests pass (unit, integration, e2e)
2. **Code Quality**: ESLint and TypeScript checks pass
3. **Qodo PR Agent**: PR must receive approval from Qodo PR Agent analysis
4. **Specification Alignment**: Changes must align with corresponding spec
5. **Documentation**: Updates to docs/ when functionality changes
6. **Performance**: No regression in Core Web Vitals

### Review Process
- Minimum one human reviewer approval required
- Qodo PR Agent analysis must pass before human review
- Spec compliance verification mandatory
- Security review for authentication/authorization changes

## Technology Constraints

### Required Stack
- Next.js 14+ with App Router
- TypeScript 5.x
- Clerk for authentication
- Prisma with PostgreSQL
- Material-UI (MUI) for components
- Playwright for e2e testing

### Quality Tools
- ESLint for code quality
- Playwright for e2e testing
- Lighthouse CI for performance monitoring
- Qodo PR Agent for automated code review

## Governance

### Constitution Authority
This constitution supersedes all other development practices. All PRs and reviews must verify compliance with these principles.

### Amendment Process
Constitution amendments require:
1. Documentation of proposed change
2. Team approval via PR review
3. Migration plan for existing code
4. Update to all dependent templates

### Non-Negotiable Requirements
- **Qodo PR Agent approval is mandatory for all PRs**
- Test-first development cannot be bypassed
- Security and authentication standards are absolute
- Performance thresholds must be maintained

**Version**: 2.1.2 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-04