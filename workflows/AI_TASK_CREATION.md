# AI Task Creation Guidelines

This guide is for AI assistants creating new development tasks in Notion.

## 📝 Configuration Variables

Values in `[brackets]` refer to configuration variables from `notion-tasks.config.json`:
- `[inProgressStatus]` → Use value from `config.inProgressStatus`
- `[testStatus]` → Use value from `config.testStatus` 
- `[completionStatus]` → Use value from `config.completionStatus`
- `[defaultStatus]` → Use value from `config.defaultStatus`
- `[from priorities array]` → Use any value from `config.priorities` array
- `[from types array]` → Use any value from `config.types` array

## 📝 Task Structure Templates

Choose the appropriate template based on task type:

### For Bug Fixes
```markdown
## Bug Description
What is the issue and how it manifests.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected vs Actual Behavior
- Expected: [what should happen]
- Actual: [what actually happens]

## Root Cause Analysis
- [ ] Identify the root cause
  - [ ] Review error logs
  - [ ] Trace code execution
- [ ] Document findings

## Fix Implementation
- [ ] Implement solution
  - [ ] Update affected components
  - [ ] Validate fix locally
- [ ] Test the fix
  - [ ] Manual testing
  - [ ] Automated tests
- [ ] Add regression test
```

### For Features
```markdown
## Description
Brief description of the new feature.

## Problem/Need
Why this feature is needed.

## Implementation
- [ ] Step 1
  - [ ] Sub-step 1.1
  - [ ] Sub-step 1.2
- [ ] Step 2
  - [ ] Sub-step 2.1
  - [ ] Sub-step 2.2
- [ ] Step 3

## Acceptance Criteria
- [ ] Criterion 1
  - [ ] Detailed check 1.1
  - [ ] Detailed check 1.2
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements
- Specific technical constraints
- Dependencies
- Performance requirements

## Testing Requirements
- [ ] Unit tests
  - [ ] Core functionality tests
  - [ ] Edge case tests
- [ ] Integration tests
  - [ ] API integration
  - [ ] UI integration
- [ ] Manual testing steps
  - [ ] User flow validation
  - [ ] Performance testing
```

### For Documentation
```markdown
## Description
What documentation needs to be created/updated.

## Scope
What should be covered in the documentation.

## Implementation
- [ ] Research existing documentation
  - [ ] Audit current docs
  - [ ] Identify gaps
- [ ] Create/update content
  - [ ] Write content sections
  - [ ] Add code examples
  - [ ] Include diagrams if needed
- [ ] Review and validate
  - [ ] Technical review
  - [ ] User testing

## Acceptance Criteria
- [ ] Documentation is complete
  - [ ] All sections covered
  - [ ] Proper formatting applied
- [ ] Examples are provided
  - [ ] Code examples work
  - [ ] Screenshots included
- [ ] Content is accurate and up-to-date
```

### For Refactoring
```markdown
## Description
What code needs to be refactored and why.

## Current Issues
Problems with the current implementation.

## Refactoring Goals
- Improve code readability
- Reduce complexity
- Enhance maintainability

## Implementation
- [ ] Identify refactoring targets
  - [ ] Analyze code complexity
  - [ ] Identify problem areas
- [ ] Plan refactoring approach
  - [ ] Define refactoring strategy
  - [ ] Plan implementation phases
- [ ] Execute refactoring
  - [ ] Phase 1: Core changes
  - [ ] Phase 2: Supporting changes
  - [ ] Phase 3: Cleanup
- [ ] Ensure no functionality changes
  - [ ] Run test suite
  - [ ] Manual verification

## Testing Requirements
- [ ] All existing tests still pass
  - [ ] Unit tests
  - [ ] Integration tests
- [ ] No regression in functionality
  - [ ] Manual testing
  - [ ] Performance validation
```

## Creation Commands

Use these exact commands to create tasks:

```bash
# Create a new task with specific properties
npx notion-ai-tasks create "Fix login bug" --type "Bug" --priority "High" --status "Not Started"

# Create with content
npx notion-ai-tasks create "Fix login bug" --content "Bug description and implementation steps" --type "Bug" --priority "High"


```

## Adding Nested Todos After Creation

Once a task is created, add nested todos to break down work:

```bash
# Add main todos
npx notion-ai-tasks todo [taskId] "Phase 1: Analysis" false
npx notion-ai-tasks todo [taskId] "Phase 2: Implementation" false

# Add nested sub-todos (2 spaces = 1 level)
npx notion-ai-tasks todo [taskId] "  Research requirements" false
npx notion-ai-tasks todo [taskId] "  Create design docs" false

# Add deeply nested todos (4 spaces = 2 levels)
npx notion-ai-tasks todo [taskId] "    Review existing docs" false
npx notion-ai-tasks todo [taskId] "    Interview stakeholders" false
```

## Task Properties
- **Type**: Values from `types` array in configuration
- **Priority**: Values from `priorities` array in configuration
- **Status**: `defaultStatus`, `inProgressStatus`, `testStatus`, `completionStatus`

## Best Practices
1. Use clear, action-oriented titles
2. Choose the appropriate template for the task type
3. Include specific acceptance criteria
4. Add detailed implementation steps as checkboxes
5. Update task status immediately after creation if starting work