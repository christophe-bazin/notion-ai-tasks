# Notion AI Tasks

**AI-powered task management bridge between development workflows and Notion databases.**

Notion AI Tasks enables AI assistants (Claude Code, GitHub Copilot, etc.) to seamlessly create, update, and execute development tasks stored in Notion. It provides structured workflows for task lifecycle management with automatic progress tracking and status transitions.

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

## 🎯 Key Features

### Core Task Management
- **Create Tasks**: Generate tasks directly from CLI with structured templates
- **Update Tasks**: Modify task status, content, and properties seamlessly
- **AI-Assisted Development**: Let AI automatically develop and execute tasks
- **Natural Language Support**: All operations work in natural language (French and English)

### Intelligent Hierarchical Structure
- **Task/Subtask Architecture**: Respects Notion's hierarchical section structure
- **Logical Iteration Order**: Todos are processed in logical order based on task hierarchy
- **Progressive Decomposition**: Complex tasks are broken down into manageable steps
- **Automatic Segmentation**: AI can segment task display and execution based on Notion structure

### Advanced AI Integration
- **AI-First Design**: Built specifically for AI assistant workflows
- **Natural Language Commands**: AI can parse commands like "work on this feature URL" or "create a task for X"
- **URL Recognition**: Automatically extracts task IDs from Notion URLs (including `p=` parameter format)
- **Complete Execution Flow**: Full task lifecycle from creation to completion with progress reporting
- **Implementation Summary**: Automatic generation of test recommendations and completion reports

### Smart Status Management
- **Automated Progression**: Tasks automatically progress from "Not Started" → "In Progress" → "Test" → "Done"
- **Test Phase Protection**: Prevents accidental auto-completion with mandatory test validation
- **Progress Tracking**: Todo completion automatically updates task status
- **Content Management**: Add progress notes and implementation details during development

### Development Workflow
- **Bidirectional Sync**: Changes are reflected in Notion in real-time
- **Structured Templates**: Pre-defined task structures for bugs, features, documentation, and refactoring
- **CLI & API**: Both command-line interface and programmatic access
- **Configurable**: Customize statuses, priorities, and types per project

## 🔄 How It Works

### AI-Powered Task Execution Workflow

1. **Context Analysis**: AI reads task specifications from Notion database and analyzes requirements
2. **Progressive Decomposition**: Complex tasks are broken down using hierarchical structure analysis
3. **Status Progression**: Task automatically moves from "Not Started" → "In Progress" when work begins
4. **Intelligent Execution**: AI processes todos in logical order based on task hierarchy and structure
5. **Real-time Updates**: Progress is tracked and synced to Notion as each todo is completed
6. **Implementation Summary**: AI generates test recommendations and completion reports
7. **Test Phase Protection**: System automatically moves task to "Test" when all todos are done (prevents accidental auto-completion)
8. **Manual Validation**: Human manually validates and marks as "Done" after testing

### Smart Status Management

- **Automatic Progression**: Tasks flow through statuses based on completion percentage
- **Test Phase**: Mandatory intermediate step between "In Progress" and "Done" 
- **Protection Against Auto-completion**: Prevents tasks from being marked "Done" without human validation
- **Progress Tracking**: Real-time updates based on todo completion status
- **Content Management**: Add implementation notes and progress updates during development

## 🎬 Demo

[![Demo Video](https://img.youtube.com/vi/8haMvOBBpws/0.jpg)](https://www.youtube.com/watch?v=8haMvOBBpws)

## 🚀 Quick Start

### Installation
```bash
npm install -g notion-ai-tasks
```

### Integration in Existing Projects

**Add these AI instructions to your project's:**

```markdown
## Backlog Management with notion-ai-tasks

### Task Execution (when given a Notion URL)
- Read and follow `AI_TASK_EXECUTION.md` workflow exactly
- Branch: `git checkout -b feat/task-name` or `git checkout -b fix/task-name`
- Commit: `feat: task-name - description` or `fix: task-name - description`

### Task Creation
- Read and follow `AI_TASK_CREATION.md` workflow exactly

### Task Updates
- Read and follow `AI_TASK_UPDATE.md` workflow exactly

### Workflow Selection
- Read `AI_WORKFLOW_SELECTOR.md` to choose the right workflow based on task type
```

**Setup Requirements:**
1. Install: `npm install -g notion-ai-tasks`
2. Create `notion-tasks.config.json` with your Notion integration
3. Add workflow instructions to your project's CLAUDE.md
4. AI will automatically read and follow the appropriate workflow

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
     "statuses": ["Not Started", "In Progress", "Test", "Done"],
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

### Configuration Fields

**Required Fields:**
- `notionToken` - Your Notion integration token
- `databaseId` - Your Notion database ID
- `defaultStatus` - Initial status for new tasks
- `inProgressStatus` - Status when work begins

**Optional Fields:**
- `testStatus` - Status for completed tasks awaiting manual validation (recommended)
- `completionStatus` - Final status for validated tasks
- `statuses`, `priorities`, `types` - Used for validation but not required

**Status Auto-Progression:**
- `defaultStatus` → `inProgressStatus` (when first todo is checked)
- `inProgressStatus` → `testStatus` (when all todos completed) 
- `testStatus` → `completionStatus` (manual only)

⚠️ **Note:** If `testStatus` is not configured, tasks will remain in `inProgressStatus` when completed, requiring manual status updates to prevent accidental auto-completion.

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

# Show task details (accepts URLs or task IDs)
notion-tasks show <task-id-or-url>
notion-tasks show "https://www.notion.so/...?p=2270fffd93c281b689c1c66099b13ef9"
```

#### Task Creation
```bash
# Create new task (basic)
notion-tasks create "Fix login bug" --type "Bug" --priority "High" --status "Not Started"

# Create with content/description
notion-tasks create "Fix login bug" --content "User cannot login due to authentication error" --type "Bug" --priority "High"

# Create with full description
notion-tasks create "Implement new feature" --content "## Problem\nUsers need better search\n\n## Solution\nAdd advanced filters" --type "Feature"
```

**Create Command Options:**
- `<title>` - Task title (required)
- `-s, --status` - Task status
- `-p, --priority` - Task priority  
- `-t, --type` - Task type
- `-c, --content` - Task description/content

#### Task Updates
```bash
# Update task properties
notion-tasks update <task-id> --status "In Progress" --priority "High"

# Update title and type
notion-tasks update <task-id> --title "Updated title" --type "Documentation"
```

**Update Command Options:**
- `<task-id>` - Task ID (required)
- `-t, --title` - New title
- `-s, --status` - New status
- `-p, --priority` - New priority
- `--type` - New type

#### Todo Management
```bash
# Add todo
notion-tasks todo <task-id> "Task to complete" false

# Mark todo as completed
notion-tasks todo <task-id> "Task to complete" true
```

**Todo Command:**
- `<task-id>` - Task ID (required)
- `<todoText>` - Todo text
- `<checked>` - true/false or 1/0 for completion status

#### Content Management
```bash
# Add content to existing task (markdown format)
notion-tasks add-content <task-id> --content "## New section\n- Added feature\n- Bug fix"

# Add simple text content
notion-tasks add-content <task-id> --text "Additional notes and progress updates"

# Add content with markdown formatting
notion-tasks add-content <task-id> -c "### Implementation Progress\n- [x] Database setup\n- [ ] API endpoints\n- [ ] Frontend integration"
```

**Add-Content Command Options:**
- `<task-id>` - Task ID (required)
- `-c, c` - Content to add in markdown format
- `-t, --text` - Simple text content to add

#### Hierarchical Task Analysis
```bash
# Analyze task structure
notion-tasks hierarchical <task-id> --structure

# Get progressive decomposition for complex tasks
notion-tasks hierarchical <task-id> --progressive

# Show task hierarchy in detail
notion-tasks hierarchical <task-id> --detailed
```

**Hierarchical Command Options:**
- `<task-id>` - Task ID (required)
- `--structure` - Show hierarchical structure analysis
- `--progressive` - Generate progressive execution steps
- `--detailed` - Show detailed hierarchy breakdown

#### Natural Language Commands (AI assistants)
```bash
# Task execution
notion-tasks work on this feature https://www.notion.so/...
notion-tasks create a task for implementing user authentication
notion-tasks update the priority of task X to High

# Content management
notion-tasks add progress notes to task Y
notion-tasks add implementation details to https://www.notion.so/...?p=abc123

# Hierarchical analysis
notion-tasks analyze the structure of task Z
notion-tasks break down this complex task https://www.notion.so/...
notion-tasks show me the progressive steps for task ABC
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

// Get task progress (completion percentage)
const progress = await taskManager.getTaskProgress(taskId);
console.log(`Task is ${progress.percentage}% complete`);

// Mark multiple steps as complete
await taskManager.markTaskProgress(taskId, [
  'Setup database',
  'Create API endpoints',
  'Add unit tests'
]);

// Auto-update task status based on progress
await taskManager.updateTaskStatusBasedOnProgress(taskId);
```

## 🛠️ API Methods

### Core Task Management
- `getTasks()` - Returns array of all tasks
- `getTask(taskId)` - Get specific task with content
- `createTask(taskData)` - Creates new task
- `updateTask(taskId, updates)` - Updates task properties
- `extractTaskIdFromUrl(url)` - Extract task ID from various Notion URL formats

### Content Management
- `addContentToTask(taskId, content)` - Adds content blocks to task
- `updateTodoInContent(taskId, todoText, checked)` - Updates specific todo

### Progress Tracking
- `getTaskProgress(taskId)` - Gets completion percentage and progress details
- `markTaskProgress(taskId, steps)` - Mark multiple steps as complete in batch
- `updateTaskStatusBasedOnProgress(taskId)` - Auto-update status based on completion percentage

### Hierarchical Task Analysis
- `analyzeTaskStructure(taskId)` - Analyze hierarchical structure of task content
- `generateProgressiveSteps(taskId)` - Generate progressive decomposition steps
- `getTaskHierarchy(taskId)` - Get detailed hierarchy breakdown

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