# Hemera Project Governance Overview

This document provides an overview of the governance structure for the Hemera learning platform
project.

## Governance Documents

### 📜 [Constitution](./constitution.md)

The main constitutional document that defines core principles and standards:

- **Test-First Development**: TDD approach with contract tests and unit tests
- **Code Quality & Formatting**: Prettier and ESLint standards enforcement
- **Feature Development Workflow**: Structured development process
- **Authentication & Security**: Clerk integration and security standards
- **Component Architecture**: Material-UI and performance guidelines

### 🧪 [Testing Standards](./testing-standards.md)

Detailed testing standards that supplement the constitution:

- **Unit Testing Standards**: Structure, naming, and coverage requirements
- **Prettier Testing Standards**: Formatting validation and CI/CD integration
- **Test-Driven Development Workflow**: Red-Green-Refactor cycle
- **Quality Gates Enforcement**: Pre-commit hooks and GitHub Actions
- **Compliance Monitoring**: Daily workflow and weekly reviews

## Quick Reference

### Daily Development Checklist

1. **Before Coding**:

   ```bash
   npm run test:prettier  # Verify Prettier setup
   ```

2. **During Development**:
   - Use VSCode auto-formatting (Format on Save enabled)
   - Follow TDD cycle: Red → Green → Refactor
   - Write unit tests for all new components/functions

3. **Before Commit**:

   ```bash
   npm run format:check   # Verify formatting
   npm run lint:ci        # Check ESLint compliance
   npm run test:unit      # Run unit tests
   ```

4. **Pre-commit hooks automatically**:
   - Format staged files with Prettier
   - Run ESLint with auto-fix
   - Validate spell checking

### Quality Gates

All code must pass these gates before merge:

- ✅ **Prettier Formatting**: `npm run format:check`
- ✅ **ESLint Validation**: `npm run lint:ci`
- ✅ **Unit Test Coverage**: Minimum 80% coverage
- ✅ **E2E Tests**: Critical path validation
- ✅ **Build Verification**: `npm run build`
- ✅ **Type Checking**: TypeScript compilation

### Testing Commands

```bash
# Unit Tests
npm run test:unit

# E2E Tests
npm run test:e2e

# Prettier Tests
npm run test:prettier

# All Quality Checks
npm run format:check && npm run lint:ci && npm run test:unit
```

## Enforcement

### Automated Enforcement

- **Pre-commit Hooks**: Husky + lint-staged automatically format and validate
- **GitHub Actions**: CI/CD workflows block merges for quality violations
- **VSCode Integration**: Real-time formatting and linting feedback

### Manual Review Process

1. **Code Review Requirements**:
   - [ ] Constitutional compliance verified
   - [ ] Unit tests cover new functionality
   - [ ] Prettier formatting is consistent
   - [ ] Security best practices followed

2. **Testing Review**:
   - [ ] TDD cycle followed (tests written first)
   - [ ] Edge cases covered
   - [ ] Contract tests define clear interfaces
   - [ ] Performance implications considered

### Exception Process

1. **Documentation**: Any deviation must be explicitly documented
2. **Justification**: Clear business or technical rationale required
3. **Team Approval**: Unanimous agreement for constitutional exceptions
4. **Time-boxing**: Temporary exceptions have defined expiration dates

## Integration with Development Tools

### VSCode Configuration

Required extensions and settings are defined in:

- `.vscode/extensions.json` - Recommended extensions
- `.vscode/settings.json` - Auto-formatting and linting configuration

### GitHub Integration

- **Workflows**: `.github/workflows/code-formatting.yml`
- **PR Templates**: Include constitutional compliance checklist
- **Branch Protection**: Require status checks before merge

### Package.json Scripts

All governance-related commands are available as npm scripts:

```json
{
  "scripts": {
    "test:prettier": "node tests/prettier-test-simple.js",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint:ci": "eslint --cache --max-warnings=0 --ext .ts,.tsx,.js,.jsx ."
  }
}
```

## Getting Started

### New Developer Onboarding

1. **Setup Development Environment**:

   ```bash
   npm install
   npm run prepare  # Install Husky hooks
   ```

2. **Install VSCode Extensions**:
   - Prettier - Code Formatter
   - ESLint
   - TypeScript and JavaScript

3. **Verify Setup**:

   ```bash
   npm run test:prettier  # Should pass all tests
   npm run format:check   # Should show no formatting issues
   ```

4. **Review Governance Documents**:
   - Read the [Constitution](./constitution.md)
   - Study [Testing Standards](./testing-standards.md)
   - Understand the TDD workflow

### Constitutional Compliance Training

1. **TDD Methodology**: Learn Red-Green-Refactor cycle
2. **Prettier Standards**: Understand formatting rules and automation
3. **Testing Patterns**: Study existing unit and E2E test examples
4. **Security Requirements**: Review Clerk authentication standards
5. **Code Review Process**: Understand quality gates and approval flow

## Continuous Improvement

### Regular Reviews

- **Weekly**: Team review of compliance metrics and quality gates
- **Monthly**: Constitutional effectiveness and amendment discussions
- **Quarterly**: Comprehensive governance audit and updates

### Metrics Tracking

- Test coverage percentages
- Prettier compliance rates
- Build failure analysis
- Code review turnaround times
- Security vulnerability response times

---

**Governance Version**: 1.0.0 | **Last Updated**: 2025-10-04 | **Next Review**: 2025-11-04
