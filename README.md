# Notion AI Tasks

**AI-powered task management bridge between development workflows and Notion databases.**

Notion AI Tasks enables AI assistants (Claude Code, GitHub Copilot, etc.) to seamlessly create, update, and execute development tasks stored in Notion. It provides structured workflows for task lifecycle management with automatic progress tracking and status transitions.

## 🎯 Key Features

- **AI-First Design**: Built specifically for AI assistant workflows
- **Natural Language Commands**: AI can parse commands like "work on this feature URL" or "create a task for X"
- **URL Recognition**: Automatically extracts task IDs from Notion URLs (including `p=` parameter format)
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
     "completionStatus": "Done"
   }
   ```

## 📋 Usage

### For AI Assistants

The tool includes comprehensive AI workflow guides:
- **workflows/AI_TASK_EXECUTION.md** - Step-by-step execution workflow
- **workflows/AI_TASK_CREATION.md** - Task creation templates and guidelines  
- **workflows/AI_TASK_UPDATE.md** - Task update and progress management

### CLI Commands

#### Basic Commands
```bash
# List all tasks
notion-tasks list

# Get task details (accepts URLs or task IDs)
notion-tasks get <task-id-or-url>
notion-tasks get "https://www.notion.so/...?p=2270fffd93c281b689c1c66099b13ef9"

# Check progress
notion-tasks progress <task-id>
```

#### Task Creation
```bash
# Create new task (basic)
notion-tasks create "Fix login bug" -t "Bug" -p "High" -s "Not Started"

# Create with description
notion-tasks create "Fix login bug" -d "User cannot login due to authentication error" -t "Bug" -p "High"

# Create with structured content (markdown)
notion-tasks create "Fix login bug" -t "Bug" -p "High" -c "## Problem\nUser login fails\n\n## Steps\n- [ ] Investigate auth flow\n- [ ] Fix bug\n- [ ] Test fix"
```

**Create Command Options:**
- `<title>` - Task title (required)
- `-d, --description` - Brief description (converted to paragraph)
- `-s, --status` - Task status
- `-p, --priority` - Task priority  
- `-t, --type` - Task type
- `-c, --content` - Full markdown content (overrides description)

#### Task Updates
```bash
# Update task properties
notion-tasks update <task-id> -s "In Progress" -p "High"

# Update checkbox properties
notion-tasks update <task-id> -c "completed=true" -c "tested=false"

# Add content to existing task
notion-tasks update <task-id> --content "## Additional Notes\nNew requirements found\n\n- [ ] Extra validation needed"
```

**Update Command Options:**
- `<id>` - Task ID (required)
- `-s, --status` - New status
- `-p, --priority` - New priority
- `-t, --type` - New type
- `-c, --checkbox` - Update checkbox (format: name=true/false)
- `--content` - Add markdown content (**NOT** `-c`, which is for checkboxes)

#### Content Management
```bash
# Add structured content blocks
notion-tasks add-content <task-id> -c "Setup database connection"
notion-tasks add-content <task-id> -h "New Section" -t "Description text"

# Update individual todos
notion-tasks update-todo <task-id> "Setup database" -c true

# Update multiple todos at once
notion-tasks update-multiple-todos <task-id> -u '[{"text":"Setup database","checked":true}]'
```

#### Natural Language Commands (AI assistants)
```bash
notion-tasks work on this feature https://www.notion.so/...
notion-tasks create a task for implementing user authentication
notion-tasks update the priority of task X to High
```

### API Usage

```javascript
import { NotionTaskManager, extractTaskIdFromUrl } from 'notion-ai-tasks';

const taskManager = new NotionTaskManager();

// Extract task ID from Notion URL
const notionUrl = "https://www.notion.so/...?p=2270fffd93c281b689c1c66099b13ef9";
const taskId = extractTaskIdFromUrl(notionUrl);

// Get all tasks
const tasks = await taskManager.getTasks();

// Create a new task
const newTask = await taskManager.createTask({
  title: 'My new task',
  status: 'In Progress',
  priority: 'High',
  type: 'Feature',
  content: [
    {
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: 'Task description' } }]
      }
    }
  ]
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
- `extractTaskIdFromUrl(url)` - Extract task ID from various Notion URL formats

## 📁 Project Structure

```
notion-ai-tasks/
├── index.js                    # Core NotionTaskManager class
├── cli.js                      # Command-line interface
├── workflow-loader.js          # Workflow file loader utility
├── notion-tasks.config.json    # Project configuration template
├── workflows/                  # AI workflow guides
│   ├── AI_WORKFLOW_SELECTOR.md # AI workflow selector
│   ├── AI_TASK_EXECUTION.md    # AI execution workflow
│   ├── AI_TASK_CREATION.md     # AI task creation guide
│   └── AI_TASK_UPDATE.md       # AI task update guide
├── README.md                   # Main documentation
└── CLAUDE.md                   # Development guidelines
```

## 🤖 AI Compatibility

- **Claude Code**: Full integration with command execution and natural language parsing
- **GitHub Copilot**: Can generate correct commands (manual execution)
- **Other AI tools**: Compatible with workflow guidelines (manual execution)

### Natural Language Examples:
```bash
# AI assistants can interpret these commands
"Work on this feature: https://www.notion.so/...?p=abc123"
"Create a task for implementing user authentication"
"Update the priority of task X to High"
"Mark the database setup todo as complete"
```

## 📝 Configuration Options

All configuration is done via `notion-tasks.config.json`:
- **Status Flow**: Configure the 4-stage status progression
- **Custom Values**: Set your own priorities, types, and defaults
- **AI Integration**: Uses `workflow-loader.js` to automatically find AI workflow guides

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