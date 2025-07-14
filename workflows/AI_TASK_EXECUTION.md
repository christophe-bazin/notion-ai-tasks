# AI Task Execution Workflow

This guide is for AI assistants executing existing Notion tasks.

## 📝 Config Variables

`[brackets]` = values from `notion-tasks.config.json`:
- `[inProgressStatus]`, `[testStatus]`, `[completionStatus]`, `[defaultStatus]`
- `[from priorities array]`, `[from types array]`

## 🚨 MANDATORY WORKFLOW

**Follow these steps EXACTLY in order:**

### Step 1: Get Task Specs
```bash
notion-tasks show <task-id>
```
Extract task-id from URL: `https://www.notion.so/task-name-2270fffd93c2816c813cc1d32ad41a73` → use `2270fffd93c2816c813cc1d32ad41a73`

### Step 2: Analysis & Comprehension
**CRITICAL: Do NOT proceed to Step 3 without completing this analysis phase.**

#### Context Analysis Checklist:
**Before implementation, answer:**

**📋 Task:** Objective? Problem solved? Target user?
**🔍 Technical:** Components affected? Dependencies? Complexity?
**🌐 Project:** Integration? Conflicts? Testing needs?
**❓ Clarification:** Ambiguous requirements? Need more info?

#### Comprehension Validation:
Write a brief summary (2-3 sentences) of your understanding:
```
"I understand this task as [objective] which will [approach] to solve [problem]. 
The implementation will involve [key components] and requires [main considerations]."
```

#### Analysis Examples:

**Bug Fix:** "Login fails with special chars" → Fix auth validation, test edge cases
**Feature:** "Add dark mode" → Theme context + CSS vars + storage, test UI

**Only proceed after completing analysis and understanding task fully.**

### Step 3: Update Status IMMEDIATELY
```bash
notion-tasks update <task-id> --status [inProgressStatus]
```

### Step 4: Analyze Task Structure & Organize Your Work
For complex Notion tasks, first analyze the hierarchical structure and follow progressive decomposition:

#### Check for Hierarchical Structure:
```bash
notion-tasks hierarchical <task-id> --structure
```

#### For Tasks with Hierarchical Content:
If the task has nested sections or todos, use progressive decomposition:
```bash
notion-tasks hierarchical <task-id> --progressive
```

**CRITICAL: Follow the generated progressive steps EXACTLY. Do NOT mix levels.**

**Progressive Execution:**
1. Get progressive steps from hierarchical command
2. Execute each step individually with exact todo list
3. Update Claude todos to match ONLY current step
4. Complete current step fully before next

**⚠️ Distinction:**
- **Claude todos** (`TodoWrite`) = Internal tracking *(Claude Code only)*
- **Notion todos** (`notion-tasks todo`) = Actual task checkboxes *(All AI assistants)*
- **Notion statuses** = Task-level statuses from config *(All AI assistants)*

**Example Progressive Execution:**
```javascript
// Generated Step 1: Overview
"Here are all the tasks to do"
Update todo
- [ ] Section 1
- [ ] Section 2  
- [ ] Section 3

// Claude todos for Step 1 ONLY (internal Claude tracking, not Notion statuses):
TodoWrite([
  {id: "1", content: "Section 1", status: "pending"},     // Claude status: pending/in_progress/completed
  {id: "2", content: "Section 2", status: "pending"},
  {id: "3", content: "Section 3", status: "pending"}
]);

// Generated Step 2: Focus on Section 1
"Working on Section 1"
Update todo
- [ ] Task 1.1
- [ ] Task 1.2

// Claude todos for Step 2 ONLY (internal Claude tracking, not Notion statuses):
TodoWrite([
  {id: "1", content: "Task 1.1", status: "in_progress"},   // Claude status: pending/in_progress/completed
  {id: "2", content: "Task 1.2", status: "pending"}
]);

// Generated Step 3: Section 1 completed - return to overview
"Section completed Section 1"
Update todo
- [x] Section 1  ✅
- [ ] Section 2
- [ ] Section 3

// Claude todos for Step 3 - overview with progress (internal Claude tracking):
TodoWrite([
  {id: "1", content: "Section 1", status: "completed"},   // Claude status: pending/in_progress/completed
  {id: "2", content: "Section 2", status: "pending"},
  {id: "3", content: "Section 3", status: "pending"}
]);

// Generated Step 4: Focus on Section 2
"Working on Section 2"  
Update todo
- [ ] Task 2.1
- [ ] Task 2.2

// Claude todos for Step 4 ONLY (internal Claude tracking, not Notion statuses):
TodoWrite([
  {id: "1", content: "Task 2.1", status: "in_progress"},   // Claude status: pending/in_progress/completed
  {id: "2", content: "Task 2.2", status: "pending"}
]);

// Generated Step 5: Section 2 completed - return to overview
"Section completed Section 2"
Update todo
- [x] Section 1  ✅
- [x] Section 2  ✅
- [ ] Section 3

// Claude todos for Step 5 - overview with progress (internal Claude tracking):
TodoWrite([
  {id: "1", content: "Section 1", status: "completed"},   // Claude status: pending/in_progress/completed
  {id: "2", content: "Section 2", status: "completed"},
  {id: "3", content: "Section 3", status: "pending"}
]);
```

#### For Simple Tasks:
For tasks without hierarchical structure, organize by simple sections:
```javascript
// Claude internal todo tracking (not Notion statuses):
TodoWrite([
  {id: "1", content: "Research requirements", status: "in_progress"},  // Claude status: pending/in_progress/completed
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

### Step 5: Update Notion Todos IMMEDIATELY After Completion
```bash
# Mark each todo as complete right after you implement it
notion-tasks todo <task-id> "todo text" true
```
**Important**: Mark each todo as complete immediately after implementing it, not at the end!

### Step 5.5: Add Additional Content if Needed
During execution, you MAY add additional content or todos if necessary for implementation:
```bash
# Add new todos discovered during development
notion-tasks add-content <task-id> -c "Additional task discovered during implementation [+]"

# Add explanatory content
notion-tasks add-content <task-id> -t "Implementation notes: [Details discovered during execution] [+]"
```
**Important**: Mark any added content with `[+]` to distinguish from original specifications.

### Step 6: Implementation Summary & Test Recommendations
When the task automatically moves to [testStatus] (all todos completed), provide a concise summary and testing guidance:

```bash
# Add implementation summary and test recommendations to task
notion-tasks add-content <task-id> -c "## 🧪 Implementation Summary & Testing Guide

### What was implemented:
- [Brief summary of key changes made]
- [Components/files modified]
- [New functionality added]

### Critical areas to test:
- [ ] [Specific functionality to verify]
- [ ] [Edge cases to check]
- [ ] [Integration points to validate]
- [ ] [Performance/security considerations]

### Test scenarios:
1. **Happy path:** [Expected normal behavior]
2. **Edge cases:** [Boundary conditions to test]
3. **Error handling:** [Failure scenarios to verify]"
```

### Step 7: Final Status Update
```bash
# Task automatically goes to [testStatus] when 100% complete
# Only mark as [completionStatus] manually after testing/validation
notion-tasks update <task-id> -s [completionStatus]
```

## ❌ NEVER DO THIS
- Never use WebFetch for Notion URLs
- Never skip step 2 (context analysis) or step 3 (status update)
- Never create your own todos without marking them [+]
- Never deviate from the core task specifications

## ✅ ALWAYS DO THIS
- Follow the exact workflow steps
- **Complete Step 2 analysis BEFORE proceeding** - understand the task context fully
- Use the todos from Notion
- **Mark todos as complete IMMEDIATELY** when you finish each one
- Update progress in real-time for better tracking
- Add additional content/todos if needed (mark with [+])
- **Provide implementation summary and test recommendations** when task moves to [testStatus]
- Task automatically moves to [testStatus] when todos are complete
- Only mark as [completionStatus] manually after testing/validation

## Example: Complete Workflow
```bash
# 1. Get task specs
notion-tasks show 2270fffd93c2816c813cc1d32ad41a73

# 2. Analysis & Comprehension (MANDATORY)
# Complete the context analysis checklist and write comprehension summary
# Example: "I understand this task as implementing user authentication 
# which will add login/logout functionality to solve user access control. 
# The implementation will involve auth middleware, JWT tokens, and login UI 
# and requires security testing and session management."

# 3. Update status immediately  
notion-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "In Progress"

# 4. Implement according to Notion task specs
# 5. Mark todos as complete IMMEDIATELY after implementing each one
notion-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Setup database" -c true
notion-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Create API endpoints" -c true
notion-tasks update-todo 2270fffd93c2816c813cc1d32ad41a73 "Add unit tests" -c true

# 5.5. Add additional content if discovered during implementation
notion-tasks add-content 2270fffd93c2816c813cc1d32ad41a73 -c "Add input validation for edge cases [+]"

# 6. Add implementation summary and test recommendations when task moves to Test
notion-tasks add-content 2270fffd93c2816c813cc1d32ad41a73 -c "## 🧪 Implementation Summary & Testing Guide
### What was implemented:
- JWT authentication system with login/logout endpoints
- User session management with secure token storage
- Input validation and error handling

### Critical areas to test:
- [ ] Login with valid/invalid credentials
- [ ] Token expiration and refresh
- [ ] Session persistence across browser restarts
- [ ] Security: SQL injection, XSS protection [+]"

# 7. Task automatically moves to "Test" when todos complete
# 8. Only mark as "Done" manually after testing/validation
notion-tasks update 2270fffd93c2816c813cc1d32ad41a73 -s "Done"
```

**This workflow is MANDATORY. Do not deviate.**