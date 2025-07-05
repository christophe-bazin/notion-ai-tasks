# Notion AI Tasks

A Node.js application to read and create development project tasks in Notion.

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your Notion integration:
   - Create a new integration at https://www.notion.so/my-integrations
   - Copy the integration token to `NOTION_TOKEN` in your `.env` file
   - Create a database in Notion with the following properties:
     - **Name** (Title) - Required
     - **Status** (Select) - Required with options: Not Started, In Progress, Done
     - **Priority** (Select) - Required with options: Low, Medium, High, Urgent
     - **Type** (Select) - Required with options: Bug, Feature, Task, Documentation, Refactoring
   - Share the database with your integration
   - Copy the database ID to `NOTION_DATABASE_ID` in your `.env` file

5. Customize configuration (optional):
   - Edit `config.json` to modify available priorities, types, and default values

## Usage

### CLI Commands

Install globally:
```bash
npm install -g .
```

List all tasks:
```bash
notion-tasks list
```

Create a new task:
```bash
notion-tasks create "My task title"
notion-tasks create "My task" -s "In Progress" -p "High" -t "Feature"
```

Update a task:
```bash
notion-tasks update <task-id> -s "Done" -p "Low" -t "Bug"
```

### Direct Usage

Run the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Features

- Read tasks from Notion database
- Create new tasks with title, status, priority, and type
- Update existing tasks
- CLI interface for easy task management
- Configurable priorities and types via `config.json`
- Export `NotionTaskManager` class for integration with other projects
- Add content blocks (headings, paragraphs, todos, bullets) to tasks
- Update todos within task content

## API Usage

### Basic Usage

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

### Available Methods

- `getTasks()` - Returns array of all tasks
- `createTask(taskData)` - Creates new task
- `updateTask(taskId, updates)` - Updates task properties
- `addContentToTask(taskId, content)` - Adds content blocks to task
- `updateTodoInContent(taskId, todoText, checked)` - Updates specific todo
- `getTaskContent(taskId)` - Gets all content blocks from task