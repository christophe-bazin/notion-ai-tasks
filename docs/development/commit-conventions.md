# Commit Conventions - notion-ai-tasks

## General Principles

**For Commits:**
- **NEVER add Claude as Co-Authored-By** in commit messages
- **Keep commit messages clean** and professional
- **Focus on the actual changes** made, not the AI assistance used
- **Subject line max 50 characters** - GitHub standard for commit titles
- **Body text max 72 characters** - Wrap commit body at 72 characters

## Branch Workflow

### **Task Execution:**
- **Always create feature branches** for Notion tasks
- **Update Notion status** to "In Progress" when starting work
- **Follow branch naming**: `feature/task-name-or-id` or `feature/short-description`
- **Keep commits atomic** and descriptive
- **Update todos progressively** in Notion during development

### **Task Execution Workflow (Feature Branches):**
```bash
# When taking a task from Notion for execution:

# 1. Create feature branch from current branch
git checkout -b feature/task-name-or-id

# 2. Update task status in Notion to "In Progress"
node cli.js update <task-id> --status "In Progress"

# 3. Work on the task following the implementation plan
# 4. Make commits with clear messages during development
# 5. Update todos in Notion as you progress
# 6. When task is complete, push branch
git push origin feature/task-name-or-id

# 7. Create PR from feature branch to main/develop
# 8. After PR merge, task will auto-update to "Test" status
```

## Fixes and Improvements

### **Use --amend for small fixes:**
For typos, small fixes, or direct improvements to the last commit:
```bash
# For small fixes or improvements to the last commit
git add .
git commit --amend
# Edit commit message to reflect the complete change
```

## Message Format

### **Recommended Structure:**
```
type: short description (max 50 chars)

Optional longer description explaining the why and context.
Wrap at 72 characters per line.

- Detail 1
- Detail 2
- Detail 3
```

### **Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### **Examples:**
```bash
# Good
git commit -m "feat: add hierarchical task parsing

- Add support for nested task structures
- Implement progressive task breakdown
- Update CLI to handle hierarchical commands"

# Good
git commit -m "fix: resolve status case sensitivity issue

Notion API returns different case than config, causing
status matching to fail. Added toLowerCase() comparison."

# Bad
git commit -m "fix stuff"
git commit -m "WIP: trying to fix the thing"
```