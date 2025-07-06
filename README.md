# Notion AI Tasks

**AI-powered task management bridge between development workflows and Notion databases.**

Notion AI Tasks enables AI assistants (Claude Code, GitHub Copilot, etc.) to seamlessly create, update, and execute development tasks stored in Notion. It provides structured workflows for task lifecycle management with automatic progress tracking and status transitions.

## 🎯 Key Features

- **AI-First Design**: Built specifically for AI assistant workflows
- **Automated Status Management**: Tasks automatically progress from "Not Started" → "In Progress" → "Test" → "Done"
- **Progress Tracking**: Todo completion automatically updates task status
- **Structured Templates**: Pre-defined task structures for bugs, features, documentation, and refactoring
- **CLI & API**: Both command-line interface and programmatic access
- **Configurable**: Customize statuses, priorities, and types per project

## 🔄 How It Works

1. **AI reads task specifications** from Notion database
2. **AI updates task status** to "In Progress" and follows implementation plan
3. **AI marks todos as complete** during development
4. **System automatically moves task to "Test"** when all todos are done
5. **Human manually marks as "Done"** after validation

## 🎬 Demo

[![Demo Video](https://img.youtube.com/vi/8haMvOBBpws/0.jpg)](https://www.youtube.com/watch?v=8haMvOBBpws)

## 🚀 Quick Start

### Installation
```bash
npm install -g notion-ai-tasks
```

### Setup

1. **Create Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Create new integration and copy the token

2. **Setup Notion Database** with these properties:
   - **Project name** (Title) - Required
   - **Status** (Select) - Required with status options (as configured in `defaultStatus`, `inProgressStatus`, `testStatus`, `completionStatus`)
   - **Priority** (Select) - Required with priority options (as configured in `priorities` array)
   - **Type** (Select) - Required with type options (as configured in `types` array)
   - Share the database with your integration

3. **Configure Project** (in your project directory):
   ```bash
   touch notion-tasks.config.json
   ```

4. **Add Configuration**:
   ```json
   {
     "notionToken": "your_notion_integration_token_here",
     "databaseId": "your_notion_database_id_here",
     "priorities": ["Low", "Medium", "High"],
     "types": ["Bug", "Feature", "Task", "Documentation", "Refactoring"],
     "defaultPriority": "Medium",
     "defaultType": "Task",
     "defaultStatus": "Not Started",
     "inProgressStatus": "In Progress",
     "testStatus": "Test",
     "completionStatus": "Done",
     "_aiInstructions": "🚀 Use 'npx notion-ai-tasks' for all Notion operations. Find npm global modules with 'npm root -g', then read $(npm root -g)/notion-ai-tasks/AI_WORKFLOW_SELECTOR.md to choose the correct workflow, then follow it EXACTLY. NEVER use WebFetch for Notion URLs."
   }
   ```

## 📋 Usage

### For AI Assistants

The tool includes comprehensive AI workflow guides:
- **AI_TASK_EXECUTION.md** - Step-by-step execution workflow
- **AI_TASK_CREATION.md** - Task creation templates and guidelines  
- **AI_TASK_UPDATE.md** - Task update and progress management

### CLI Commands

```bash
# List all tasks
notion-tasks list

# Get task details
notion-tasks get <task-id>

# Create new task
notion-tasks create "Fix login bug" -t "Bug" -p "High"

# Update task status
notion-tasks update <task-id> -s "In Progress"

# Add content to task
notion-tasks add-content <task-id> -c "Setup database connection"

# Update todo progress
notion-tasks update-todo <task-id> "Setup database" -c true

# Check progress
notion-tasks progress <task-id>
```

### API Usage

```javascript
import { NotionTaskManager } from 'notion-ai-tasks';

const taskManager = new NotionTaskManager();

// Get all tasks
const tasks = await taskManager.getTasks();

// Create a new task
const newTask = await taskManager.createTask({
  title: 'My new task',
  status: 'In Progress',
  priority: 'High',
  type: 'Feature'
});

// Update a task
await taskManager.updateTask(taskId, {
  status: 'Done',
  priority: 'Medium'
});

// Add content to a task
await taskManager.addContentToTask(taskId, [
  {
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: 'Description' } }]
    }
  },
  {
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: 'Complete this task' } }],
      checked: false
    }
  }
]);

// Update a todo in task content
await taskManager.updateTodoInContent(taskId, 'Complete this task', true);
```

## 🛠️ API Methods

- `getTasks()` - Returns array of all tasks
- `getTask(taskId)` - Get specific task with content
- `createTask(taskData)` - Creates new task
- `updateTask(taskId, updates)` - Updates task properties
- `addContentToTask(taskId, content)` - Adds content blocks to task
- `updateTodoInContent(taskId, todoText, checked)` - Updates specific todo
- `getTaskProgress(taskId)` - Gets completion percentage
- `markTaskProgress(taskId, steps)` - Mark multiple steps complete
- `updateTaskStatusBasedOnProgress(taskId)` - Auto-update status based on progress

## 📁 Project Structure

```
notion-ai-tasks/
├── index.js                    # Core NotionTaskManager class
├── cli.js                      # Command-line interface
├── notion-tasks.config.json    # Project configuration
├── AI_TASK_EXECUTION.md        # AI execution workflow
├── AI_TASK_CREATION.md         # AI task creation guide
├── AI_TASK_UPDATE.md           # AI task update guide
└── AI_WORKFLOW_SELECTOR.md     # AI workflow selector
```

## 🤖 AI Compatibility

- **Claude Code**: Full integration with command execution
- **GitHub Copilot**: Can generate correct commands (manual execution)
- **Other AI tools**: Compatible with workflow guidelines (manual execution)

## 📝 Configuration Options

All configuration is done via `notion-tasks.config.json`:
- **Status Flow**: Configure the 4-stage status progression
- **Custom Values**: Set your own priorities, types, and defaults
- **AI Instructions**: Critical AI guidance via `_aiInstructions` (directs AI to use correct workflows)

## 🔧 Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# Development with auto-reload
npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.