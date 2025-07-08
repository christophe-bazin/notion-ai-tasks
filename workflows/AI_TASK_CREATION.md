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
- [ ] Document findings

## Fix Implementation
- [ ] Implement solution
- [ ] Test the fix
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
- [ ] Step 2
- [ ] Step 3

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements
- Specific technical constraints
- Dependencies
- Performance requirements

## Testing Requirements
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing steps
```

### For Documentation
```markdown
## Description
What documentation needs to be created/updated.

## Scope
What should be covered in the documentation.

## Implementation
- [ ] Research existing documentation
- [ ] Create/update content
- [ ] Review and validate

## Acceptance Criteria
- [ ] Documentation is complete
- [ ] Examples are provided
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
- [ ] Plan refactoring approach
- [ ] Execute refactoring
- [ ] Ensure no functionality changes

## Testing Requirements
- [ ] All existing tests still pass
- [ ] No regression in functionality
```

## Creation Commands

```bash
# Create a new task with specific properties
notion-ai-tasks create "Fix login bug" --type "Bug" --priority "High" --status "Not Started"

# Create with content
notion-ai-tasks create "Fix login bug" --content "Brief description of the bug" --type "Bug" --priority "High"

# Add todos after creation
notion-ai-tasks todo [taskId] "Step 1" false
notion-ai-tasks todo [taskId] "Step 2" false

# Update task status
notion-ai-tasks update <task-id> --status "In Progress"
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