# AI Workflow Selector

**Choose the appropriate workflow based on your task:**

## 🎯 Task Execution (Most Common)
**When:** User gives you a Notion URL to implement/execute an existing task

**Example:** "Please implement this feature: https://www.notion.so/task-url"

**Action:** Read and follow `AI_TASK_EXECUTION.md` EXACTLY

## 🆕 Task Creation  
**When:** User wants you to create a new task in Notion

**Example:** "Create a task for implementing user authentication"

**Action:** Read and follow `AI_TASK_CREATION.md` EXACTLY

## ✏️ Task Update
**When:** User wants to manually update an existing task

**Example:** "Update the priority of task X" or "Mark these todos as complete"

**Action:** Read and follow `AI_TASK_UPDATE.md` EXACTLY

---

## 🚨 CRITICAL: For Task Execution (Most Common Case)

**If user provides a Notion URL, you MUST:**

1. **NEVER use WebFetch**
2. **IMMEDIATELY read `AI_TASK_EXECUTION.md`**
3. **Follow the 5-step workflow EXACTLY**

**The 5-step workflow is:**
1. `npx notion-ai-tasks get <task-id>`
2. `npx notion-ai-tasks update <task-id> -s "In Progress"`
3. Use EXACT todos from Notion (don't create your own)
4. Update todos during development
5. Mark task as "Done" when finished

**FAILURE TO FOLLOW = TASK FAILURE**