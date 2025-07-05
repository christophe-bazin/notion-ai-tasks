# AI Task Execution Workflow

This guide is for AI assistants executing existing Notion tasks.

## 🚨 MANDATORY WORKFLOW

**Follow these steps EXACTLY in order:**

### Step 1: Get Task Specs
```bash
npx notion-ai-tasks get <task-id>
```
Extract task-id from URL: `https://www.notion.so/task-name-2270fffd93c2816c813cc1d32ad41a73` → use `2270fffd93c2816c813cc1d32ad41a73`

### Step 2: Update Status IMMEDIATELY
```bash
npx notion-ai-tasks update <task-id> -s "In Progress"
```

### Step 3: Use Notion Todos
- Use the EXACT todos from the Notion task content
- Do NOT create your own todos
- Follow the implementation plan specified in the task

### Step 4: Update Todos During Development
```bash
npx notion-ai-tasks update-todo <task-id> "todo text" -c true
```

### Step 5: Final Status Update
```bash
npx notion-ai-tasks update <task-id> -s "Done"
```

## ❌ NEVER DO THIS
- Never use WebFetch for Notion URLs
- Never skip step 2 (status update)
- Never create your own todos
- Never deviate from the task specifications

## ✅ ALWAYS DO THIS
- Follow the exact workflow steps
- Use the todos from Notion
- Update progress in real-time
- Mark task as "Done" when finished

## Example: Complete Workflow
```bash
# 1. Get task specs
npx notion-ai-tasks get 2270fffd93c2816c813cc1d32ad41a73

# 2. Update status immediately
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "In Progress"

# 3. Implement according to Notion task specs
# 4. Update todos as you complete them
npx notion-ai-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Setup database" -c true

# 5. Final status update
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "Done"
```

**This workflow is MANDATORY. Do not deviate.**