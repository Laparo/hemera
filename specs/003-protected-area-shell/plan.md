# Implementation Plan: Protected Area Shell

**Branch**: `003-protected-area-shell` | **Date**: 4. Oktober 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-protected-area-shell/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Protected Area Shell provides authenticated layout and role-based navigation for the Hemera learning
platform. The feature creates a secure foundation for protected content delivery using Clerk
authentication with Next.js App Router Server Components. Users access a clean, role-appropriate
interface with Dashboard, Courses, and Admin sections based on their assigned roles.

## Technical Context

**Language/Version**: TypeScript 5.2.2, Next.js 14.2.3  
**Primary Dependencies**: @clerk/nextjs, @mui/material, Prisma  
**Storage**: Vercel Postgres (Prisma managed)  
**Testing**: Playwright (E2E), Jest (Unit)  
**Target Platform**: Web (Vercel deployment)  
**Project Type**: web - Next.js App Router with SSR  
**Performance Goals**: <200ms TTFB, <100ms auth checks  
**Constraints**: SSR for security, no client-side auth exposure  
**Scale/Scope**: Multi-role access (user/admin), 3 navigation areas

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Simplicity Principle**: Single-purpose protected layout with clear role-based navigation  
✅ **Security-First**: Server-side authentication checks, no client-side auth exposure  
✅ **Test Coverage**: E2E auth flows, unit tests for role permissions, contract validation  
✅ **Performance Standards**: SSR targets met (<200ms TTFB, secure auth checks)  
✅ **No Architectural Violations**: Uses existing Next.js App Router, MUI theming, Clerk integration

**Status**: ✅ PASS - No constitutional violations identified

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real directories captured
above]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot` **IMPORTANT**: Execute it exactly
     as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base template
- Generate implementation tasks from Phase 1 design artifacts
- Contract tests → Test implementation tasks [P] (parallel execution)
- Component contracts → Component creation tasks [P]
- Authentication flow → Middleware and auth setup tasks
- Error handling → Error boundary and fallback tasks

**Specific Task Categories**:

1. **Authentication Setup Tasks**:
   - Configure Clerk environment variables
   - Create middleware for route protection
   - Set up auth helper utilities

2. **Component Implementation Tasks**:
   - Create ProtectedLayout component [P]
   - Create ProtectedNavigation component [P]
   - Implement role-based rendering logic

3. **Testing Tasks**:
   - Implement E2E auth flow tests [P]
   - Create component unit tests [P]
   - Add role permission tests [P]
   - Performance validation tests

**Ordering Strategy**:

- **Phase 1**: Authentication infrastructure (middleware, auth utilities)
- **Phase 2**: Core components (layout, navigation) [P - parallel execution]
- **Phase 3**: Testing implementation [P - parallel execution]
- **Phase 4**: Integration and validation testing

**Dependency Management**:

- Middleware must complete before components (auth dependency)
- Components can be built in parallel once auth is ready
- Tests can be implemented in parallel with components
- Performance tests run after core implementation

**Estimated Output**:

- 15-20 numbered, ordered tasks in tasks.md
- Clear parallel execution markers [P] for independent tasks
- TDD approach: Test tasks before implementation tasks
- Dependencies clearly documented between tasks

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
