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

### Step 3: Organize Your Work with Claude Todos
When working on complex Notion tasks, organize your work using Claude's TodoWrite tool:

#### For Tasks with Markdown Sections (# ## ### Titles):
When Notion task has content sections with any heading level:
```markdown
# Main Section
## Bug Description
## Root Cause Analysis
### Detailed Analysis
### Impact Assessment
## Fix Implementation  
## Testing Requirements
```

Organize your Claude todos by sections (adapt the # level to match):
```javascript
// Start with main section
TodoWrite([
  {id: "main", content: "Complete # Main Section", status: "in_progress"}
]);

// Progress through sub-sections
TodoWrite([
  {id: "main", content: "Complete # Main Section", status: "in_progress"},
  {id: "bug-desc", content: "Complete ## Bug Description section", status: "in_progress"}
]);

// Handle deeper nesting (### level)
TodoWrite([
  {id: "main", content: "Complete # Main Section", status: "in_progress"},
  {id: "bug-desc", content: "Complete ## Bug Description section", status: "in_progress"},
  {id: "detailed", content: "Complete ### Detailed Analysis subsection", status: "in_progress"}
]);

// Continue sequentially through all levels
TodoWrite([
  {id: "main", content: "Complete # Main Section", status: "in_progress"},
  {id: "bug-desc", content: "Complete ## Bug Description section", status: "completed"},
  {id: "root-cause", content: "Complete ## Root Cause Analysis section", status: "in_progress"}
]);
```

#### For Tasks with Nested Todos:
When Notion task has nested structure like:
```
☐ Phase A: Preparation
  ☐ Step A1: Research
    ☐ Sub-step A1.1
```

Organize your Claude todos by levels:
```javascript
// Level 1: Work on main phase
TodoWrite([
  {id: "phase-a", content: "Phase A: Preparation", status: "in_progress"}
]);

// Level 2: Drill down to steps
TodoWrite([
  {id: "phase-a", content: "Phase A: Preparation", status: "completed"},
  {id: "step-a1", content: "Phase A → Step A1: Research", status: "in_progress"}
]);

// Level 3: Handle sub-steps
TodoWrite([
  {id: "phase-a", content: "Phase A: Preparation", status: "completed"},
  {id: "step-a1", content: "Phase A → Step A1: Research", status: "completed"},
  {id: "substep-a11", content: "Phase A → Step A1 → Sub-step A1.1", status: "in_progress"}
]);
```

#### For Tasks with BOTH Sections AND Nested Todos:
When a task has both markdown sections (any # level) and nested todos within sections:
```javascript
// Work on section first (use actual # level from Notion)
TodoWrite([
  {id: "impl-section", content: "Complete ## Fix Implementation section", status: "in_progress"}
]);

// Then drill down to nested todos within that section
TodoWrite([
  {id: "impl-section", content: "Complete ## Fix Implementation section", status: "in_progress"},
  {id: "impl-solution", content: "## Fix Implementation → Implement solution", status: "in_progress"}
]);

// Handle sub-items within the todo (maintain section context)
TodoWrite([
  {id: "impl-section", content: "Complete ## Fix Implementation section", status: "in_progress"},
  {id: "impl-solution", content: "## Fix Implementation → Implement solution", status: "completed"},
  {id: "impl-test", content: "## Fix Implementation → Test the fix", status: "in_progress"}
]);
```

**Key Principles:**
- Work **sequentially** through sections/levels
- **Add todos progressively** as you drill down
- **Keep completed context** in your todo list
- **Respect dependencies** (parent before child)
- **Combine section names** with arrow notation (→) for nested items

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