# Hemera Constitution

<!--
SYNC IMPACT REPORT - Constitution Amendment
Version Change: 1.3.0 → 1.4.0
Amendment Date: 2025-10-11
Amendment Type: MINOR (Rollbar error monitoring integration standards added)

Modified Sections:
- Enhanced: Core Technologies (added Rollbar for error monitoring)
- Enhanced: Authentication & Security (added Rollbar monitoring and error reporting security)
- Enhanced: Feature Development Workflow (added error monitoring integration)
- Enhanced: Testing Requirements (added error monitoring tests)
- Enhanced: Code Organization (added Rollbar integration standards)
- Enhanced: Testing Compliance (added error monitoring validation)
- Added: Error Monitoring & Observability (new section VI for comprehensive error tracking)

Key Changes:
- Rollbar integration mandatory for all production applications
- Client-side React Error Boundaries for component error capture
- Server-side error tracking for all API routes and functions
- Performance monitoring for critical user flows
- Security incident tracking and authentication failure monitoring
- Environment-specific Rollbar project separation
- Real-time alerting for critical errors and performance issues
- Data privacy protection in error reports (PII filtering)
- CI/CD integration testing for error monitoring functionality

Rationale: Adding Rollbar error monitoring standards ensures comprehensive observability
and production reliability while maintaining constitutional quality standards for all
error tracking and performance monitoring functionality.
-->

<!--
SYNC IMPACT REPORT - Constitution Amendment
Version Change: 1.2.0 → 1.3.0
Amendment Date: 2025-10-11
Amendment Type: MINOR (Vibe-Check Protocol added)

Modified Sections:
- Added: Vibe-Check Protocol (new section in Governance for team wellness and culture health)
- Enhanced: Testing Compliance (extended governance framework)

Key Changes:
- Vibe-Check Protocol for sustainable development practices
- Team wellness and culture health monitoring
- Burnout prevention measures
- Collaboration spirit guidelines
- Work-life balance enforcement
- Innovation encouragement framework

Rationale: Adding Vibe-Check Protocol ensures sustainable team health and positive
development culture while maintaining constitutional quality standards. Recognizes
that code quality depends on team wellness and sustainable practices.
-->

<!--
SYNC IMPACT REPORT - Constitution Amendment
Version Change: 1.1.0 → 1.2.0
Amendment Date: 2025-10-09
Amendment Type: MINOR (Stripe payment integration standards added)

Modified Sections:
- Enhanced: Core Technologies (added Stripe payment processing)
- Enhanced: Authentication & Security (added payment security standards)
- Enhanced: Test-First Development (added payment testing requirements)
- Enhanced: Feature Development Workflow (added payment integration requirements)
- Enhanced: Testing Requirements (added payment integration testing)
- Enhanced: Code Organization (added payment processing standards)
- Enhanced: Deployment Standards (added payment configuration management)
- Enhanced: GitHub Actions Workflow Requirements (added payment security)
- Enhanced: Testing Compliance (added payment flow testing)

Key Changes:
- Stripe integration mandatory for all payment processing
- PCI DSS compliance requirements for payment flows
- Test/live mode separation for development and production
- Webhook security validation requirements
- Payment flow testing standards
- Secure payment configuration management

Rationale: Adding Stripe payment integration standards ensures secure, compliant
payment processing while maintaining constitutional quality standards for all
payment-related functionality.
-->

<!--
SYNC IMPACT REPORT - Constitution Amendment
Version Change: 1.0.0 → 1.1.0
Amendment Date: 2025-10-05
Amendment Type: MINOR (new deployment standards and GitHub Actions workflow requirements added)

Modified Sections:
- Added: Deployment Standards (new section with CI/CD pipeline requirements)
- Added: GitHub Actions Workflow Requirements (new section defining deployment workflow standards)
- Enhanced: Technology Stack Requirements (expanded Development Tools section)

New Files Created:
- .github/workflows/deploy.yml (GitHub Actions deployment workflow)

Templates Requiring Updates:
✅ Constitution updated with deployment standards
✅ Deployment workflow created with quality gates
⚠ Templates may need review for deployment-related guidance

Key Changes:
- Mandatory quality gates for all deployments (TypeScript, Prettier, ESLint, tests, build)
- Automatic preview deployments for pull requests via Vercel
- Production deployment restricted to main branch only
- Post-deployment E2E testing against production environment
- Proper secret management for Vercel integration

Rationale: Adding structured deployment process ensures constitutional compliance extends
to production releases, maintaining code quality and testing standards throughout the
entire software delivery lifecycle.
-->

<!-- Next.js Learning Platform with Clerk Authentication -->

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

Test-Driven Development is mandatory for all features and components:

- **Contract Tests First**: All new features must start with failing contract tests that define
  expected behavior
- **Unit Tests Required**: Every component, utility, and service must have comprehensive unit tests
- **TDD Cycle**: Red (failing tests) → Green (minimal implementation) → Refactor → Repeat
- **Test Coverage**: Minimum 80% code coverage for critical paths, 90% for authentication and
  payment flows
- **Payment Testing**: All Stripe integration must use test mode for development with mock payment
  scenarios
- **Prettier Tests**: Code formatting tests ensure consistent style across the entire codebase

### II. Code Quality & Formatting

Consistent code quality and formatting standards are enforced:

- **Prettier Integration**: All code must pass Prettier formatting checks before commit
- **ESLint Compliance**: Zero warnings policy for production code
- **Pre-commit Hooks**: Automated formatting and linting on every commit via Husky
- **CI/CD Gates**: GitHub Actions workflows block merges for formatting violations
- **TypeScript Strict Mode**: Full type safety with strict TypeScript configuration

### III. Feature Development Workflow

Every feature follows a structured development process:

- **Specification First**: Features start with detailed specifications in `specs/` directory
- **Contract Definition**: API contracts and component interfaces defined before implementation
- **Payment Integration**: All payment flows integrate with Stripe using secure webhook handling
- **Authentication Integration**: All protected features integrate with Clerk authentication system
- **Database Migration**: Schema changes require proper Prisma migrations with rollback strategy
- **Performance Testing**: Load testing for user-facing features, especially authentication and
  payment flows
- **Payment Security Testing**: Stripe webhook validation and secure checkout flow testing
- **Error Monitoring Integration**: Rollbar error tracking configured for development and production
  environments

### VI. Error Monitoring & Observability

Comprehensive error tracking and performance monitoring for production reliability:

- **Rollbar Integration**: Mandatory error tracking for all production applications
- **Client-Side Monitoring**: React Error Boundaries capture unhandled component errors
- **Server-Side Tracking**: All API routes and server functions report errors to Rollbar
- **Performance Monitoring**: Track critical user flows and performance bottlenecks
- **Error Classification**: Proper error categorization and severity levels
- **Security Incident Tracking**: Monitor for authentication failures and security breaches
- **Environment Separation**: Separate Rollbar projects for development, staging, and production
- **Alert Configuration**: Real-time notifications for critical errors and performance degradation
- **Data Privacy**: Sensitive information filtered from error reports (PII, tokens, passwords)
- **Integration Testing**: Error monitoring functionality validated in CI/CD pipeline

### IV. Authentication & Security

Security-first approach to user authentication, payment processing, data protection, and error
monitoring:

- **Clerk Integration**: All authentication flows use Clerk APIs and middleware
- **Stripe Security**: Payment processing through Stripe with PCI DSS compliance and webhook
  verification
- **Rollbar Monitoring**: Comprehensive error tracking with client-side and server-side monitoring
- **Role-Based Access**: User roles (student, instructor, admin) enforce proper access control
- **Protected Routes**: Middleware validation for all `/protected` routes
- **Session Management**: Secure session handling with proper token validation
- **Payment Security**: Stripe secret keys managed through environment variables with test/live mode
  separation
- **Error Reporting Security**: Rollbar integration with proper data filtering and access token
  management
- **CVE Monitoring**: Regular dependency vulnerability scanning and updates

### V. Component Architecture

Modular, reusable component design principles:

- **Material-UI Integration**: All UI components follow Material-UI design system
- **Theme Consistency**: Centralized theme management for dark/light mode support
- **Component Testing**: Each UI component has dedicated unit tests for behavior and rendering
- **Accessibility Standards**: WCAG 2.1 AA compliance for all interactive elements
- **Performance Optimization**: Lazy loading, code splitting, and bundle optimization

## Development Standards

### Testing Requirements

- **Unit Tests**: Located in `tests/unit/` with `.spec.ts` extension
- **E2E Tests**: Playwright tests in `tests/e2e/` covering critical user journeys
- **Contract Tests**: API and component contract validation before implementation
- **Prettier Tests**: Automated formatting validation with `npm run test:prettier`
- **Performance Tests**: Load testing for authentication and course enrollment flows
- **Payment Integration Tests**: Stripe webhook testing and checkout flow validation
- **Error Monitoring Tests**: Rollbar integration testing for error capture and reporting
- **Security Tests**: Vulnerability scanning and penetration testing for auth flows

### Code Organization

- **Feature Folders**: Group related components, tests, and utilities by feature
- **Shared Libraries**: Common utilities in `lib/` directory with proper TypeScript exports
- **Database Layer**: Prisma ORM with type-safe database operations
- **API Routes**: Next.js API routes with proper error handling and validation
- **Payment Processing**: Stripe integration with secure webhook endpoints and proper error handling
- **Error Monitoring**: Rollbar integration with React Error Boundaries and server-side error
  tracking
- **Component Structure**: Separate presentational and container components

### Quality Gates

All code changes must pass these gates before merge:

- **Prettier Formatting**: `npm run format:check` must pass
- **ESLint Validation**: `npm run lint:ci` with zero warnings
- **Type Checking**: TypeScript compilation without errors
- **Unit Test Coverage**: Minimum 80% coverage for new code
- **E2E Test Suite**: Critical path tests must pass
- **Build Verification**: `npm run build` completes successfully
- **Deployment Pipeline**: GitHub Actions deployment workflow must complete successfully
- **Preview Testing**: All pull requests must deploy successfully to preview environment

## Deployment Requirements

### CI/CD Pipeline Standards

All deployments follow the GitHub Actions workflow (`.github/workflows/deploy.yml`):

- **Quality Gates First**: No deployment without passing all quality checks
- **Preview Environment**: Every PR gets a unique Vercel preview deployment
- **Production Deployment**: Only main branch triggers production releases
- **Post-Deployment Validation**: E2E tests run against live production environment
- **Rollback Capability**: Failed deployments trigger immediate rollback procedures

## Technology Stack Requirements

### Core Technologies

- **Frontend**: Next.js 14+ with App Router, React 18+, TypeScript 5+
- **Authentication**: Clerk for user management and session handling
- **Payments**: Stripe for secure payment processing and subscription management
- **Database**: PostgreSQL with Prisma ORM for type-safe operations
- **Styling**: Material-UI (MUI) with custom theme support
- **Testing**: Playwright for E2E, Jest/Vitest for unit tests
- **Error Monitoring**: Rollbar for comprehensive error tracking and performance monitoring
- **Code Quality**: Prettier, ESLint, Husky for pre-commit hooks

### Development Tools

- **Package Manager**: npm with package-lock.json for reproducible builds
- **Version Control**: Git with conventional commit messages
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Code Editor**: VSCode with recommended extensions for Prettier and ESLint
- **Database Migration**: Prisma migrations with proper versioning

### Deployment Standards

All deployments follow a structured CI/CD pipeline with mandatory quality gates:

- **Quality Gates**: Every deployment must pass TypeScript compilation, Prettier formatting, ESLint
  validation, unit tests, and build verification
- **Preview Deployments**: All pull requests automatically deploy to Vercel preview environments
  with unique URLs
- **Production Deployment**: Only `main` branch pushes trigger production deployments to Vercel
- **Post-Deployment Testing**: E2E tests run against production environment after successful
  deployment
- **Rollback Strategy**: Failed deployments must be immediately rolled back with incident
  documentation
- **Environment Secrets**: All sensitive configuration managed through Vercel environment variables
  and GitHub secrets
- **Payment Configuration**: Stripe keys (test/live) managed securely with environment-based mode
  switching

### GitHub Actions Workflow Requirements

The deployment workflow (`.github/workflows/deploy.yml`) enforces constitutional compliance:

- **Multi-Stage Pipeline**: Separate jobs for quality gates, preview deployment, production
  deployment, and E2E validation
- **Dependency Chain**: Production deployment only occurs after all quality gates pass
- **Automated PR Comments**: Preview deployment URLs automatically posted to pull request comments
- **Artifact Management**: Playwright reports uploaded for debugging failed E2E tests
- **Security**: VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID managed as GitHub repository
  secrets
- **Payment Security**: Stripe webhook secrets and API keys secured in repository secrets with
  proper test/live separation

## Governance

### Constitution Enforcement

This constitution supersedes all other development practices and must be followed strictly:

- **PR Reviews**: All pull requests must verify constitutional compliance
- **Quality Gates**: Automated checks enforce formatting, testing, and build requirements
- **Exception Process**: Any deviation requires explicit justification and team approval
- **Regular Audits**: Monthly reviews of compliance and process effectiveness

### Amendment Process

- **Documentation Required**: All changes must be documented with clear rationale
- **Team Approval**: Constitutional changes require unanimous team agreement
- **Migration Plan**: Breaking changes need detailed migration and rollback strategies
- **Version Control**: All amendments are tracked with proper versioning

### Testing Compliance

- **Unit Test Mandate**: No feature implementation without corresponding unit tests
- **Prettier Compliance**: All code must pass `npm run test:prettier` validation
- **Contract Validation**: API and component contracts must be tested before implementation
- **Payment Flow Testing**: Stripe checkout and webhook flows must be validated in test mode
- **Error Monitoring Validation**: Rollbar error tracking must be tested for both client and server
  scenarios
- **Performance Benchmarks**: Authentication flows must meet sub-100ms response requirements
- **Security Validation**: All auth-related code requires security review and testing
- **Payment Security Compliance**: All Stripe integrations must follow PCI DSS guidelines and use
  secure webhook handling

### Vibe-Check Protocol

Team wellness and code culture health checks ensure sustainable development practices:

- **Daily Standup Vibes**: Team energy assessment during daily meetings - are we energized or burned
  out?
- **Code Review Atmosphere**: Constructive, supportive feedback culture over harsh criticism
- **Feature Delivery Pressure**: Sustainable pace over crunch mode - no shipping broken code under
  pressure
- **Learning Environment**: Mistakes are learning opportunities, not blame targets
- **Work-Life Balance**: Respect for boundaries - no expectation for weekend or late-night coding
- **Technical Debt Acknowledgment**: Regular honest assessment of code quality without shame
- **Collaboration Spirit**: "We build together" mentality over individual hero culture
- **Innovation Encouragement**: Safe space for experimenting with new ideas and approaches
- **Celebration Moments**: Acknowledge wins, both technical achievements and personal growth
- **Burnout Prevention**: Watch for signs of exhaustion and address them proactively

**Vibe-Check Triggers**:

- Weekly team retrospectives include explicit vibe assessment
- Pull request comments that feel harsh trigger team discussion
- Multiple late-night commits in a week trigger workload review
- Repeated "quick fixes" without tests trigger technical debt discussion
- Team member expressing frustration triggers one-on-one check-in

**Version**: 1.4.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-11
