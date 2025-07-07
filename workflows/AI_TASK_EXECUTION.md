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
For complex Notion tasks, first analyze the hierarchical structure and follow progressive decomposition:

#### Check for Hierarchical Structure:
```bash
npx notion-ai-tasks hierarchical <task-id> --structure
```

#### For Tasks with Hierarchical Content:
If the task has nested sections or todos, use progressive decomposition:
```bash
npx notion-ai-tasks hierarchical <task-id> --progressive
```

**CRITICAL: Follow the generated progressive steps EXACTLY. Do NOT mix levels.**

**Progressive Execution Workflow:**
1. **Get the progressive steps** from the hierarchical command
2. **Execute each step individually** following the exact todo list provided
3. **Update Claude todos to match ONLY the current step** - don't mix with other levels
4. **Complete current step fully** before moving to next step

**Example Progressive Execution:**
```javascript
// Generated Step 1: Overview
"Here are all the tasks to do"
Update todo
- [ ] Section 1
- [ ] Section 2  
- [ ] Section 3

// Claude todos for Step 1 ONLY:
TodoWrite([
  {id: "1", content: "Section 1", status: "pending"},
  {id: "2", content: "Section 2", status: "pending"},
  {id: "3", content: "Section 3", status: "pending"}
]);

// Generated Step 2: Focus on Section 1
"Working on Section 1"
Update todo
- [ ] Task 1.1
- [ ] Task 1.2

// Claude todos for Step 2 ONLY:
TodoWrite([
  {id: "1", content: "Task 1.1", status: "in_progress"},
  {id: "2", content: "Task 1.2", status: "pending"}
]);

// Generated Step 3: Section 1 completed - return to overview
"Section completed Section 1"
Update todo
- [x] Section 1  ✅
- [ ] Section 2
- [ ] Section 3

// Claude todos for Step 3 - overview with progress:
TodoWrite([
  {id: "1", content: "Section 1", status: "completed"},
  {id: "2", content: "Section 2", status: "pending"},
  {id: "3", content: "Section 3", status: "pending"}
]);

// Generated Step 4: Focus on Section 2
"Working on Section 2"  
Update todo
- [ ] Task 2.1
- [ ] Task 2.2

// Claude todos for Step 4 ONLY:
TodoWrite([
  {id: "1", content: "Task 2.1", status: "in_progress"},
  {id: "2", content: "Task 2.2", status: "pending"}
]);

// Generated Step 5: Section 2 completed - return to overview
"Section completed Section 2"
Update todo
- [x] Section 1  ✅
- [x] Section 2  ✅
- [ ] Section 3

// Claude todos for Step 5 - overview with progress:
TodoWrite([
  {id: "1", content: "Section 1", status: "completed"},
  {id: "2", content: "Section 2", status: "completed"},
  {id: "3", content: "Section 3", status: "pending"}
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
- **Generate progressive steps first** using hierarchical command
- **Follow generated steps exactly** - each step provides the complete todo list for that level
- **Match Claude todos to current step only** - don't carry forward other sections/levels
- **Return to overview after each section** - the system generates overview return steps automatically
- **Update section status progressively** - mark sections as completed when returning to overview
- **Complete current step fully** before advancing to next step
- **Never mix hierarchical levels** in Claude todos

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