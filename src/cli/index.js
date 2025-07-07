#!/usr/bin/env node

import { TaskManager } from '../core/TaskManager.js';
import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { listCommand } from './commands/list.js';
import { showCommand } from './commands/show.js';
import { createCommand } from './commands/create.js';
import { updateCommand } from './commands/update.js';
import { todoCommand } from './commands/todo.js';
import { naturalCommand } from './commands/natural.js';
import { hierarchicalCommand } from './commands/hierarchical.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

let taskManager;

program
  .name('notion-tasks')
  .description('CLI to manage Notion tasks')
  .version(packageJson.version);

program
  .command('list')
  .description('List all tasks')
  .action(async () => {
    taskManager = taskManager || new TaskManager();
    await listCommand(taskManager);
  });

program
  .command('show <taskId>')
  .description('Show detailed information about a specific task')
  .action(async (taskId) => {
    taskManager = taskManager || new TaskManager();
    await showCommand(taskManager, taskId);
  });

program
  .command('create <title>')
  .description('Create a new task')
  .option('-s, --status <status>', 'Task status')
  .option('-p, --priority <priority>', 'Task priority')
  .option('-t, --type <type>', 'Task type')
  .option('-c, --content <content>', 'Task content/description')
  .action(async (title, options) => {
    taskManager = taskManager || new TaskManager();
    await createCommand(taskManager, title, options);
  });

program
  .command('update <taskId>')
  .description('Update an existing task')
  .option('-t, --title <title>', 'New title')
  .option('-s, --status <status>', 'New status')
  .option('-p, --priority <priority>', 'New priority')
  .option('--type <type>', 'New type')
  .action(async (taskId, options) => {
    taskManager = taskManager || new TaskManager();
    await updateCommand(taskManager, taskId, options);
  });

program
  .command('todo <taskId> <todoText> <checked>')
  .description('Create or update a todo item within a task')
  .action(async (taskId, todoText, checked) => {
    taskManager = taskManager || new TaskManager();
    const isChecked = checked === 'true' || checked === '1';
    await todoCommand(taskManager, taskId, todoText, isChecked);
  });

program
  .command('hierarchical <taskId>')
  .description('Analyze and manage hierarchical task structure')
  .option('-s, --structure', 'Show hierarchical structure')
  .option('-p, --progressive', 'Generate progressive todo steps')
  .action(async (taskId, options) => {
    await hierarchicalCommand(taskId, options);
  });

program
  .argument('[instruction...]', 'Natural language instruction')
  .action(async (instruction) => {
    if (!instruction || instruction.length === 0) {
      program.help();
    } else {
      taskManager = taskManager || new TaskManager();
      await naturalCommand(taskManager, instruction);
    }
  });

program.exitOverride();

program.configureOutput({
  writeErr: (str) => {
    if (str.includes('unknown option')) {
      console.error(`❌ ${str.replace('error: ', '')}`);
      console.log('\n💡 Use --help to see available options');
    } else {
      console.error(str);
    }
  },
  writeOut: (str) => {
    console.log(str);
  }
});

try {
  program.parse();
} catch (error) {
  process.exit(1);
}