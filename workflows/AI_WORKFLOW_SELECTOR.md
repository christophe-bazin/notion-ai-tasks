# AI Workflow Selector

**Choose workflow based on task type:**

## 🎯 Task Execution (Most Common)
**When:** User provides Notion URL to implement/execute existing task
**Action:** Follow `AI_TASK_EXECUTION.md` EXACTLY

## 🆕 Task Creation
**When:** User wants to create new task in Notion
**Action:** Follow `AI_TASK_CREATION.md` EXACTLY

## ✏️ Task Update
**When:** User wants to manually update existing task
**Action:** Follow `AI_TASK_UPDATE.md` EXACTLY

---

## 🚨 CRITICAL: Task Execution Workflow

**If user provides Notion URL:**

1. **NEVER use WebFetch**
2. **Read `AI_TASK_EXECUTION.md`**
3. **Follow 5-step workflow EXACTLY:**
   - `notion-tasks show <task-id>`
   - `notion-tasks update <task-id> -s "In Progress"`
   - Use EXACT todos from Notion
   - Update todos during development
   - Mark task as "Done" when finished

**FAILURE TO FOLLOW = TASK FAILURE**