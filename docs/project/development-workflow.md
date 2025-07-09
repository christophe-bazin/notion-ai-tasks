# Development Workflow - notion-ai-tasks

## Git Workflow Integration

### **Development Process:**
- **Feature branches** for all development work
- **Notion status updates** during development
- **Clear commit messages** following conventions
- **Pull request workflow** for code review

## Development Context

### **Local Development Commands:**
Always use local development syntax when working on the project:
```bash
# Task management
node cli.js list
node cli.js show <task-id>
node cli.js update <task-id> --status "In Progress"

# Advanced commands
node cli.js todo <task-id> "Task description" true
node cli.js add-content <task-id> --content "Content"
```

## Task Execution Workflow

### **Feature Branch Workflow:**
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

## Development Best Practices

### **Branch Management:**
- **Always create feature branches** for Notion tasks
- **Follow branch naming**: `feature/task-name-or-id` or `feature/short-description`
- **Keep commits atomic** and descriptive
- **Update todos progressively** in Notion during development

### **Notion Integration:**
- **Update task status** to "In Progress" when starting work
- **Track progress** through Notion todos
- **Maintain task context** in Notion during development
- **Auto-update to "Test"** status after PR merge

## Integration with Development Process

### **Git Integration:**
- **Feature branch creation** linked to task status
- **Commit messages** reference task IDs when relevant
- **PR creation** can trigger status updates
- **Merge completion** updates task to "Test" status

### **Documentation Updates:**
When completing development tasks, ensure:
- **README.md** updates for new features
- **CLAUDE.md** updates for process changes
- **Configuration examples** stay current
- **File structure documentation** reflects actual structure

### **Testing Integration:**
- **Task completion** requires testing
- **Status transitions** validate completion
- **Error handling** provides clear feedback
- **Configuration validation** prevents issues

## AI Workflow Integration

For AI-specific workflows (task creation, natural language processing, etc.), see:
- [AI Workflow Files](../../workflows/) - Operational AI workflows
- [Command Strategy](./command-strategy.md) - Different command contexts
- [Configuration Examples](../examples/config-examples.md) - Setup examples