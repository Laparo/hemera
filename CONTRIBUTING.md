# Contributing to Hemera

Welcome to Hemera! This document outlines our development process and contribution requirements.

## Constitution Compliance

All contributions must comply with the [Hemera Constitution](./.specify/memory/constitution.md). This includes mandatory requirements that cannot be bypassed.

## Pull Request Requirements

### ✅ Mandatory Checks (Non-Negotiable)

Every pull request **MUST** pass the following before merge:

1. **Qodo PR Agent Approval** 🤖
   - All PRs are automatically analyzed by Qodo PR Agent
   - PR must receive approval from the agent before human review
   - Agent feedback must be addressed or justified

2. **Automated Testing** 🧪
   - All TypeScript compilation must pass
   - ESLint linting with zero warnings
   - All automated tests (unit, integration, e2e) must pass
   - No performance regressions

3. **Specification Compliance** 📋
   - Changes must align with corresponding feature spec
   - New features require complete spec documentation
   - Implementation must follow specs-first workflow

4. **Human Review** 👥
   - Minimum one approving review from team member
   - Security review required for auth/authorization changes
   - Performance impact assessment for significant changes

## Development Workflow

### 1. Before Starting
- Create or update feature specification in `specs/`
- Ensure specification is complete and approved
- Generate implementation tasks

### 2. Development Process
- Follow Test-Driven Development (TDD)
- Write tests first, implement after
- Ensure all commits align with specification
- Run local quality checks frequently

### 3. Pull Request Submission
- Create PR with descriptive title and description
- Link to corresponding feature specification
- Wait for Qodo PR Agent analysis
- Address all agent feedback before requesting human review

### 4. Review Process
- Qodo PR Agent runs automatic analysis
- Human reviewers verify spec compliance
- All feedback must be addressed
- Merge only after all checks pass

## Quality Tools

### Required Tools
- **Qodo PR Agent**: Automated code review and quality analysis
- **ESLint**: Code quality and style enforcement
- **Playwright**: End-to-end testing
- **Lighthouse CI**: Performance monitoring

### Local Development
```bash
# Run all quality checks locally
npm run lint
npm run build
npm test
npm run test:e2e
```

## Technology Stack

### Core Technologies
- Next.js 14+ with App Router
- TypeScript 5.x
- Clerk for authentication
- Prisma with PostgreSQL
- Material-UI (MUI) for components

### Quality Assurance
- Jest/Vitest for unit testing
- Playwright for e2e testing
- Lighthouse for performance metrics
- Qodo PR Agent for automated review

## Non-Negotiable Requirements

### 🚫 Absolute Requirements
1. **Qodo PR Agent approval is mandatory** - No exceptions
2. **Test-first development** - Cannot be bypassed
3. **Specification compliance** - All changes must align with specs
4. **Performance standards** - Core Web Vitals must be maintained
5. **Security standards** - Authentication/authorization must be production-grade

### ⚠️ Common Issues
- **Bypassing Qodo PR Agent**: Not allowed under any circumstances
- **Implementing without specs**: All features need complete specifications
- **Skipping tests**: TDD is mandatory for all code changes
- **Performance regressions**: Must be addressed before merge

## Getting Help

### Resources
- Constitution: `./.specify/memory/constitution.md`
- Feature Specs: `./specs/`
- Quality Gates: See GitHub workflows in `./.github/workflows/`

### Process Questions
- Review the constitution for definitive answers
- Check existing specifications for similar patterns
- Consult with team leads for clarification

## Amendment Process

Changes to this process or the constitution require:
1. Documentation of proposed change
2. Team consensus via PR review
3. Constitutional amendment process
4. Update to all affected documentation

---

**Remember**: Qodo PR Agent approval is not optional. It's a mandatory quality gate that ensures code consistency and adherence to our standards.