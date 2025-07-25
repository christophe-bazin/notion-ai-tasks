# AI Task Update Guidelines

This guide is for AI assistants updating existing Notion tasks manually (not during execution).

## 📝 Config Variables

`[brackets]` = values from `notion-tasks.config.json`:
- `[inProgressStatus]`, `[testStatus]`, `[completionStatus]`, `[defaultStatus]`
- `[from priorities array]`, `[from types array]`

## 🔄 Update Commands Reference

### Basic Task Updates
```bash
# Update task properties (status, priority, type)
notion-tasks update <task-id> -s [inProgressStatus] -p [from priorities array] -t [from types array]

# Update checkbox properties
notion-tasks update <task-id> -c "completed=true" -c "tested=false"

# Add content to existing task
notion-tasks update <task-id> --content "## New Section\nContent in markdown format\n\n- [ ] New todo item"
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

## Common Update Scenarios

### 1. Adding New Requirements
```bash
# First get current task content
notion-tasks get <task-id>

# Add structured content with new requirements
notion-tasks update <task-id> --content "## Additional Requirements\n- [ ] New requirement 1\n- [ ] New requirement 2"

# Or add individual todo items
notion-tasks update-todo <task-id> "New requirement" -c false
```

### 2. Changing Priority/Status
```bash
# Update priority due to changed business needs
notion-tasks update <task-id> -p "High"

# Change status when work is paused
notion-tasks update <task-id> -s "Not Started"
```

### 3. Bulk Todo Updates
```bash
# Mark multiple items as complete
notion-tasks update-multiple-todos <task-id> -u '[
  {"text":"Design database schema","checked":true},
  {"text":"Implement API endpoints","checked":true},
  {"text":"Add unit tests","checked":false}
]'
```

### 4. Progress Tracking
```bash
# Check current completion status
notion-tasks progress <task-id>

# Auto-update status based on completion percentage
notion-tasks update-status <task-id>
```


## Important: Command Options Reference

### Create Command Options
- `<title>` - Task title (required, positional argument)
- `-d, --description` - Brief description (converted to paragraph content)
- `-s, --status` - Task status
- `-p, --priority` - Task priority
- `-t, --type` - Task type
- `-c, --content` - Full markdown content (overrides description)

### Update Command Options
- `<id>` - Task ID (required, positional argument)
- `-s, --status` - New status
- `-p, --priority` - New priority
- `-t, --type` - New type
- `-c, --checkbox` - Update checkbox properties (format: name=true/false)
- `--content` - Add markdown content to task (NOT -c, which is for checkboxes)

## Best Practices

1. **Always check current state first**: Use `notion-tasks get <task-id>` before making updates
2. **Update status appropriately**: Match status with actual progress
3. **Use bulk updates**: For multiple todo changes, use `update-multiple-todos`
4. **Track progress**: Use `progress` command to see completion percentage
5. **Auto-update status**: Use `update-status` to automatically set status based on todo completion
6. **Content vs Checkbox**: Use `--content` for markdown content, `-c` for checkbox properties

## Example: Complete Update Workflow
```bash
# 1. Check current task state
notion-tasks get <task-id>

# 2. Update specific todos
notion-tasks update-todo <task-id> "Database setup" -c true

# 3. Check progress
notion-tasks progress <task-id>

# 4. Auto-update status if needed
notion-tasks update-status <task-id>
```