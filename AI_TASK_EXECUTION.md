# AI Task Execution Workflow

This guide is for AI assistants executing existing Notion tasks.

## 📝 Configuration Variables

Values in `[brackets]` refer to configuration variables from `notion-tasks.config.json`:
- `[inProgressStatus]` → Use value from `config.inProgressStatus`
- `[testStatus]` → Use value from `config.testStatus` 
- `[completionStatus]` → Use value from `config.completionStatus`
- `[defaultStatus]` → Use value from `config.defaultStatus`
- `[from priorities array]` → Use any value from `config.priorities` array
- `[from types array]` → Use any value from `config.types` array

## 🚨 MANDATORY WORKFLOW

**Follow these steps EXACTLY in order:**

### Step 1: Get Task Specs
```bash
npx notion-ai-tasks get <task-id>
```
Extract task-id from URL: `https://www.notion.so/task-name-2270fffd93c2816c813cc1d32ad41a73` → use `2270fffd93c2816c813cc1d32ad41a73`

### Step 2: Update Status IMMEDIATELY
```bash
npx notion-ai-tasks update <task-id> -s [inProgressStatus]
```

### Step 3: Use Notion Todos
- Use the EXACT todos from the Notion task content
- Do NOT create your own todos
- Follow the implementation plan specified in the task

### Step 4: Update Todos During Development
```bash
npx notion-ai-tasks update-todo <task-id> "todo text" -c true
```

### Step 4.5: Add Additional Content if Needed
During execution, you MAY add additional content or todos if necessary for implementation:
```bash
# Add new todos discovered during development
npx notion-ai-tasks add-content <task-id> -c "Additional task discovered during implementation [+]"

# Add explanatory content
npx notion-ai-tasks add-content <task-id> -t "Implementation notes: [Details discovered during execution] [+]"
```
**Important**: Mark any added content with `[+]` to distinguish from original specifications.

### Step 5: Final Status Update
```bash
# Task automatically goes to [testStatus] when 100% complete
# Only mark as [completionStatus] manually after testing/validation
npx notion-ai-tasks update <task-id> -s [completionStatus]
```

## ❌ NEVER DO THIS
- Never use WebFetch for Notion URLs
- Never skip step 2 (status update)
- Never create your own todos without marking them [+]
- Never deviate from the core task specifications

## ✅ ALWAYS DO THIS
- Follow the exact workflow steps
- Use the todos from Notion
- Update progress in real-time
- Add additional content/todos if needed (mark with [+])
- Task automatically moves to [testStatus] when todos are complete
- Only mark as [completionStatus] manually after testing/validation

## Example: Complete Workflow
```bash
# 1. Get task specs
npx notion-ai-tasks get 2270fffd93c2816c813cc1d32ad41a73

# 2. Update status immediately
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "In Progress"

# 3. Implement according to Notion task specs
# 4. Update todos as you complete them
npx notion-ai-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Setup database" -c true

# 4.5. Add additional content if discovered during implementation
npx notion-ai-tasks add-content 2270fffd93c2816c813cc1d32ad41a73 -c "Add input validation for edge cases [+]"

# 5. Task automatically moves to "Test" when todos complete
# 6. Only mark as "Done" manually after testing/validation
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "Done"
```

**This workflow is MANDATORY. Do not deviate.**