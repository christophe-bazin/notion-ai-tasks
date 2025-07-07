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
npx notion-ai-tasks show <task-id>
```
Extract task-id from URL: `https://www.notion.so/task-name-2270fffd93c2816c813cc1d32ad41a73` → use `2270fffd93c2816c813cc1d32ad41a73`

### Step 2: Update Status IMMEDIATELY
```bash
npx notion-ai-tasks update <task-id> --status [inProgressStatus]
```

### Step 3: Analyze Task Structure & Organize Your Work
For complex Notion tasks, first analyze the hierarchical structure and organize your work using Claude's TodoWrite tool:

#### Check for Hierarchical Structure:
```bash
npx notion-ai-tasks hierarchical <task-id> --structure
```

#### For Tasks with Hierarchical Content:
If the task has nested sections or todos, use progressive decomposition:
```bash
npx notion-ai-tasks hierarchical <task-id> --progressive
```

This will generate step-by-step todos organized by hierarchy. Follow the generated steps:

**Example Progressive Execution:**
```javascript
// Step 1: Overview of all main sections
TodoWrite([
  {id: "1", content: "Database Setup", status: "pending"},
  {id: "2", content: "API Implementation", status: "pending"},
  {id: "3", content: "Testing", status: "pending"}
]);

// Step 2: Work on "Database Setup" section
TodoWrite([
  {id: "1", content: "Database Setup", status: "in_progress"},
  {id: "2", content: "API Implementation", status: "pending"},
  {id: "3", content: "Testing", status: "pending"}
]);

// Step 3: Drill down to sub-tasks in "Database Setup"
TodoWrite([
  {id: "1", content: "Database Setup", status: "in_progress"},
  {id: "1a", content: "Create schema", status: "in_progress"},
  {id: "1b", content: "Add migrations", status: "pending"}
]);

// Step 4: Complete sub-tasks and move to next
TodoWrite([
  {id: "1", content: "Database Setup", status: "completed"},
  {id: "2", content: "API Implementation", status: "in_progress"},
  {id: "3", content: "Testing", status: "pending"}
]);
```

#### For Simple Tasks:
For tasks without hierarchical structure, organize by simple sections:
```javascript
TodoWrite([
  {id: "1", content: "Research requirements", status: "in_progress"},
  {id: "2", content: "Implement solution", status: "pending"},
  {id: "3", content: "Test implementation", status: "pending"}
]);
```

**Key Principles:**
- **Use hierarchical analysis** for complex tasks
- **Work sequentially** through sections/levels  
- **Add todos progressively** as you drill down
- **Keep completed context** in your todo list
- **Respect dependencies** (parent before child)

### Step 4: Update Notion Todos IMMEDIATELY After Completion
```bash
# Mark each todo as complete right after you implement it
npx notion-ai-tasks todo <task-id> "todo text" true
```
**Important**: Mark each todo as complete immediately after implementing it, not at the end!

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
- **Mark todos as complete IMMEDIATELY** when you finish each one
- Update progress in real-time for better tracking
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
# 4. Mark todos as complete IMMEDIATELY after implementing each one
npx notion-ai-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Setup database" -c true
npx notion-ai-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Create API endpoints" -c true
npx notion-ai-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Add unit tests" -c true

# 4.5. Add additional content if discovered during implementation
npx notion-ai-tasks add-content 2270fffd93c2816c813cc1d32ad41a73 -c "Add input validation for edge cases [+]"

# 5. Task automatically moves to "Test" when todos complete
# 6. Only mark as "Done" manually after testing/validation
npx notion-ai-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "Done"
```

**This workflow is MANDATORY. Do not deviate.**