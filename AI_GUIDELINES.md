# AI Task Creation Guidelines

This document provides guidelines for AI assistants to create well-structured development tasks in Notion using the notion-ai-tasks tool.

## 🚨 CRITICAL: Task Retrieval Method

**ALWAYS use `notion-ai-tasks get` instead of WebFetch for Notion URLs:**

❌ **WRONG - Do NOT use WebFetch:**
```
Fetch(https://www.notion.so/task-url)
```

✅ **CORRECT - Use notion-ai-tasks:**
```bash
npx notion-ai-tasks get <task-id>
```

**Why?** WebFetch retrieves raw HTML, but `notion-ai-tasks get` retrieves structured task content with todos, requirements, and specifications.

**Task ID extraction:** From URL `https://www.notion.so/task-name-2270fffd93c2816c813cc1d32ad41a73`, use ID `2270fffd93c2816c813cc1d32ad41a73`

## 📝 Task Structure in Notion

Each task should follow this structure:

### Title
Clear, action-oriented task title (e.g., "Add user authentication middleware")

### Properties
- **Type**: [Bug|Feature|Task|Documentation|Refactoring]
- **Priority**: [Low|Medium|High]
- **Status**: [Not Started|In Progress|Done]

### Content Structure
The content should be adapted based on the task type:

#### For Bug fixes:
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

#### For Features:
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

#### For Documentation:
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

#### For Refactoring:
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

## Update Commands Reference

The tool provides several commands to update tasks and their progress:

### Basic Task Updates
```bash
# Update task properties (status, priority, type)
notion-tasks update <task-id> -s "In Progress" -p "High" -t "Bug"

# Update checkbox properties
notion-tasks update <task-id> -c "completed=true" -c "tested=false"
```

### Todo Management
```bash
# Update a single todo item in task content
notion-tasks update-todo <task-id> "Setup database" -c true

# Update multiple todos at once
notion-tasks update-multiple-todos <task-id> -u '[{"text":"Setup database","checked":true},{"text":"Create API","checked":true}]'

# Mark progress by completing X number of steps
notion-tasks mark-progress <task-id> 3
```

### Status Management
```bash
# Auto-update task status based on todo completion progress
notion-tasks update-status <task-id>

# Check current progress
notion-tasks progress <task-id>
```

## ⚠️ Important: When to Update Tasks

**CRITICAL**: Always update task status when working on it:

1. **Before starting work**: Update status to "In Progress"
   ```bash
   notion-tasks update <task-id> -s "In Progress"
   ```

2. **During work**: Update todos as you complete them
   ```bash
   notion-tasks update-todo <task-id> "Setup database" -c true
   ```

3. **After completing work**: Update status to "Done"
   ```bash
   notion-tasks update <task-id> -s "Done"
   ```

**AI Assistants**: You MUST update the task status immediately when you start working on a task, not just when you finish it.

## Configuration Reference

The tool uses `notion-tasks.config.json` with these options:
- **priorities**: ["Low", "Medium", "High"]
- **types**: ["Bug", "Feature", "Task", "Documentation", "Refactoring"]  
- **statuses**: ["Not Started", "In Progress", "Done"]
- **defaults**: Medium priority, Task type, Not Started status

## How to Use These Guidelines

### For AI Assistants
1. **Read the guidelines**: Always read this file (`AI_GUIDELINES.md`) when working with notion-ai-tasks
2. **CRITICAL - Get task specs**: Use `npx notion-ai-tasks get <task-id>` to retrieve task specifications (NEVER use WebFetch)
3. **Verify task access**: If step 2 fails, STOP immediately and inform user
4. **MANDATORY - Update status**: IMMEDIATELY after getting task specs, run `npx notion-ai-tasks update <task-id> -s "In Progress"`
5. **Analyze the codebase**: Understand what needs to be done by reading the code
6. **Determine task type**: Based on the work needed, choose the appropriate type (Bug, Feature, Task, Documentation, Refactoring)
7. **Use the right template**: Apply the content structure that matches the task type
8. **Create the task**: Use the notion-ai-tasks tool to create a well-structured task
9. **Update status and progress during development**: 
   - Update individual todos as you complete them using `update-todo`
   - Mark multiple steps as complete using `mark-progress`
   - Update final status to "Done" when task is completed

### Example Workflow
```bash
# 1. Read the guidelines
cat AI_GUIDELINES.md

# 2. CRITICAL - Get task specifications (extract task-id from URL)
npx notion-ai-tasks get 2270fffd93c2816c813cc1d32ad41a73

# 3. If step 2 fails, STOP and inform user
# If successful, continue with implementation

# 4. MANDATORY - Update task status IMMEDIATELY after getting specs
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "In Progress"

# 5. Analyze the codebase to understand what needs to be done
# (use code analysis tools, read files, etc.)

# 6. Continue with implementation work

# 7. Update individual todos in task content as you complete them
npx notion-ai-tasks update-todo <task-id> "Identify the root cause" -c true

# 8. Mark progress by completing multiple steps at once
npx notion-ai-tasks mark-progress <task-id> 3

# 9. Update multiple todos at once
npx notion-ai-tasks update-multiple-todos <task-id> -u '[{"text":"Setup database","checked":true},{"text":"Create API","checked":true}]'

# 10. Auto-update status based on progress
npx notion-ai-tasks update-status <task-id>

# 11. When task is fully completed, update final status
npx notion-ai-tasks update <task-id> -s "Done"
```

### Integration with Other Projects
When using notion-ai-tasks in another project:
1. Ensure `notion-tasks.config.json` exists in the project root
2. Read these guidelines to understand task structure
3. Adapt the content based on the specific project's needs
4. Follow the type-specific templates for consistent task creation