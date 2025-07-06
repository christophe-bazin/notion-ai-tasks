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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

const taskManager = new TaskManager();

program
  .name('notion-tasks')
  .description('CLI to manage Notion tasks')
  .version(packageJson.version);

program
  .command('list')
  .description('List all tasks')
  .action(async () => {
    await listCommand(taskManager);
  });

program
  .command('show <taskId>')
  .description('Show detailed information about a specific task')
  .action(async (taskId) => {
    await showCommand(taskManager, taskId);
  });

program
  .command('create <title>')
  .description('Create a new task')
  .option('-s, --status <status>', 'Task status')
  .option('-p, --priority <priority>', 'Task priority')
  .option('-t, --type <type>', 'Task type')
  .action(async (title, options) => {
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
    await updateCommand(taskManager, taskId, options);
  });

program
  .command('todo <taskId> <todoText> <checked>')
  .description('Update a todo item within a task')
  .action(async (taskId, todoText, checked) => {
    const isChecked = checked === 'true' || checked === '1';
    await todoCommand(taskManager, taskId, todoText, isChecked);
  });

program
  .argument('[instruction...]', 'Natural language instruction')
  .action(async (instruction) => {
    if (!instruction || instruction.length === 0) {
      program.help();
    } else {
      await naturalCommand(taskManager, instruction);
    }
  });

function collect(value, previous) {
  return previous.concat([value]);
}

program.parse();