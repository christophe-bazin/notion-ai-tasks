# AI Task Update Guidelines

This guide is for AI assistants updating existing Notion tasks manually (not during execution).

## 🔄 Update Commands Reference

### Basic Task Updates
```bash
# Update task properties (status, priority, type)
npx notion-ai-tasks update <task-id> -s "In Progress" -p "High" -t "Bug"

# Update checkbox properties
npx notion-ai-tasks update <task-id> -c "completed=true" -c "tested=false"
```

### Todo Management
```bash
# Update a single todo item in task content
npx notion-ai-tasks update-todo <task-id> "Setup database" -c true

# Update multiple todos at once
npx notion-ai-tasks update-multiple-todos <task-id> -u '[{"text":"Setup database","checked":true},{"text":"Create API","checked":true}]'

# Mark progress by completing X number of steps
npx notion-ai-tasks mark-progress <task-id> 3
```

### Status Management
```bash
# Auto-update task status based on todo completion progress
npx notion-ai-tasks update-status <task-id>

# Check current progress
npx notion-ai-tasks progress <task-id>
```

## Common Update Scenarios

### 1. Adding New Requirements
```bash
# First get current task content
npx notion-ai-tasks get <task-id>

# Then update with additional todos or requirements
npx notion-ai-tasks update-todo <task-id> "New requirement" -c false
```

### 2. Changing Priority/Status
```bash
# Update priority due to changed business needs
npx notion-ai-tasks update <task-id> -p "High"

# Change status when work is paused
npx notion-ai-tasks update <task-id> -s "Not Started"
```

### 3. Bulk Todo Updates
```bash
# Mark multiple items as complete
npx notion-ai-tasks update-multiple-todos <task-id> -u '[
  {"text":"Design database schema","checked":true},
  {"text":"Implement API endpoints","checked":true},
  {"text":"Add unit tests","checked":false}
]'
```

### 4. Progress Tracking
```bash
# Check current completion status
npx notion-ai-tasks progress <task-id>

# Auto-update status based on completion percentage
npx notion-ai-tasks update-status <task-id>
```

## Configuration Reference

The tool uses `notion-tasks.config.json` with these options:
- **priorities**: ["Low", "Medium", "High"]
- **types**: ["Bug", "Feature", "Task", "Documentation", "Refactoring"]  
- **statuses**: ["Not Started", "In Progress", "Done"]
- **defaults**: Medium priority, Task type, Not Started status

## Best Practices

1. **Always check current state first**: Use `npx notion-ai-tasks get <task-id>` before making updates
2. **Update status appropriately**: Match status with actual progress
3. **Use bulk updates**: For multiple todo changes, use `update-multiple-todos`
4. **Track progress**: Use `progress` command to see completion percentage
5. **Auto-update status**: Use `update-status` to automatically set status based on todo completion

## Example: Complete Update Workflow
```bash
# 1. Check current task state
npx notion-ai-tasks get <task-id>

# 2. Update specific todos
npx notion-ai-tasks update-todo <task-id> "Database setup" -c true

# 3. Check progress
npx notion-ai-tasks progress <task-id>

# 4. Auto-update status if needed
npx notion-ai-tasks update-status <task-id>
```