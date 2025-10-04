# GitHub Branch Protection Configuration

This document outlines the required GitHub branch protection rules for the Hemera repository to enforce the constitutional requirement for Qodo PR Agent approval.

## Branch Protection Rules for `main`

### Required Status Checks
The following status checks must pass before merging:

#### Automated Quality Checks
- `build` - TypeScript compilation and Next.js build
- `lint` - ESLint code quality check  
- `test` - Automated test suite (unit, integration, e2e)
- `lighthouse-ci` - Performance monitoring
- `docs-markdownlint` - Documentation quality
- `docs-cspell` - Spell checking
- `docs-link-check` - Link validation

#### Qodo PR Agent (Constitutional Requirement)
- `qodo-pr-agent` - Automated code review and approval
- `qodo-pr-describe` - PR description generation
- `qodo-pr-improve` - Code improvement suggestions

### Branch Protection Settings

```yaml
Branch Protection Rule: main
├── Require a pull request before merging: ✅ ENABLED
│   ├── Require approvals: ✅ 1 approval required
│   ├── Dismiss stale reviews: ✅ ENABLED
│   ├── Require review from CODEOWNERS: ✅ ENABLED
│   └── Restrict pushes that create files: ✅ ENABLED
├── Require status checks to pass: ✅ ENABLED
│   ├── Require branches to be up to date: ✅ ENABLED
│   └── Status checks (ALL REQUIRED):
│       ├── build
│       ├── lint  
│       ├── test
│       ├── lighthouse-ci
│       ├── docs-markdownlint
│       ├── docs-cspell
│       ├── docs-link-check
│       ├── qodo-pr-agent ⭐ CONSTITUTIONAL REQUIREMENT
│       ├── qodo-pr-describe
│       └── qodo-pr-improve
├── Require conversation resolution: ✅ ENABLED
├── Require signed commits: ✅ ENABLED (recommended)
├── Require linear history: ✅ ENABLED (recommended)
├── Restrict pushes to matching branches: ✅ ENABLED
└── Do not allow bypassing settings: ✅ ENABLED
```

## Constitutional Compliance

### Non-Negotiable Requirements
According to the Hemera Constitution v2.1.2:

> **Qodo PR Agent approval is mandatory for all PRs**

This means:
- ❌ No administrator override allowed
- ❌ No emergency bypass permitted  
- ❌ No "urgent" exceptions
- ✅ ALL PRs must pass Qodo PR Agent analysis

### Implementation Steps

1. **Repository Settings** → **Branches** → **Add rule**
2. **Branch name pattern**: `main`
3. **Enable all protections** as listed above
4. **Add required status checks** including all Qodo PR Agent jobs
5. **Save changes**

### Verification

To verify the protection is working:
1. Create a test PR
2. Confirm Qodo PR Agent runs automatically
3. Verify PR cannot be merged without agent approval
4. Confirm all other status checks are required

## Troubleshooting

### Common Issues

**Issue**: Qodo PR Agent not running
- **Solution**: Check GitHub secrets (`OPENAI_KEY`, `GITHUB_TOKEN`)
- **Verify**: Workflow file permissions are correct

**Issue**: Status check not appearing
- **Solution**: Status check name must match workflow job name exactly
- **Verify**: Check `.github/workflows/qodo-pr-agent.yml`

**Issue**: Administrator bypass
- **Solution**: Ensure "Do not allow bypassing settings" is enabled
- **Constitutional Note**: This would violate the constitution

### Support

For issues with branch protection:
1. Check GitHub workflow status
2. Verify all required secrets are configured
3. Confirm workflow permissions are correct
4. Review constitutional requirements

---

**Important**: These settings enforce the constitutional requirement that Qodo PR Agent approval is mandatory. Disabling or bypassing these protections violates the project constitution.