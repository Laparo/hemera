# Hemera Constitution

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
- **Authentication Integration**: All protected features integrate with Clerk authentication system
- **Database Migration**: Schema changes require proper Prisma migrations with rollback strategy
- **Performance Testing**: Load testing for user-facing features, especially authentication flows

### IV. Authentication & Security

Security-first approach to user authentication and data protection:

- **Clerk Integration**: All authentication flows use Clerk APIs and middleware
- **Role-Based Access**: User roles (student, instructor, admin) enforce proper access control
- **Protected Routes**: Middleware validation for all `/protected` routes
- **Session Management**: Secure session handling with proper token validation
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
- **Security Tests**: Vulnerability scanning and penetration testing for auth flows

### Code Organization

- **Feature Folders**: Group related components, tests, and utilities by feature
- **Shared Libraries**: Common utilities in `lib/` directory with proper TypeScript exports
- **Database Layer**: Prisma ORM with type-safe database operations
- **API Routes**: Next.js API routes with proper error handling and validation
- **Component Structure**: Separate presentational and container components

### Quality Gates

All code changes must pass these gates before merge:

- **Prettier Formatting**: `npm run format:check` must pass
- **ESLint Validation**: `npm run lint:ci` with zero warnings
- **Type Checking**: TypeScript compilation without errors
- **Unit Test Coverage**: Minimum 80% coverage for new code
- **E2E Test Suite**: Critical path tests must pass
- **Build Verification**: `npm run build` completes successfully

## Technology Stack Requirements

### Core Technologies

- **Frontend**: Next.js 14+ with App Router, React 18+, TypeScript 5+
- **Authentication**: Clerk for user management and session handling
- **Database**: PostgreSQL with Prisma ORM for type-safe operations
- **Styling**: Material-UI (MUI) with custom theme support
- **Testing**: Playwright for E2E, Jest/Vitest for unit tests
- **Code Quality**: Prettier, ESLint, Husky for pre-commit hooks

### Development Tools

- **Package Manager**: npm with package-lock.json for reproducible builds
- **Version Control**: Git with conventional commit messages
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Code Editor**: VSCode with recommended extensions for Prettier and ESLint
- **Database Migration**: Prisma migrations with proper versioning

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
- **Performance Benchmarks**: Authentication flows must meet sub-100ms response requirements
- **Security Validation**: All auth-related code requires security review and testing

**Version**: 1.0.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-04
