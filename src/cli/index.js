#!/usr/bin/env node

import { TaskManager } from '../core/TaskManager.js';
import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Lazy loading for commands
const loadCommand = async (commandName) => {
  const { [commandName]: command } = await import(`./commands/${commandName.split('Command')[0]}.js`);
  return command;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

let taskManager;

const getTaskManager = () => taskManager || (taskManager = new TaskManager());

program
  .name('notion-tasks')
  .description('CLI to manage Notion tasks')
  .version(packageJson.version);

const commands = [
  {
    name: 'list',
    description: 'List all tasks',
    action: async () => {
      const listCommand = await loadCommand('listCommand');
      await listCommand(getTaskManager());
    }
  },
  {
    name: 'show <taskId>',
    description: 'Show detailed information about a specific task',
    action: async (taskId) => {
      const showCommand = await loadCommand('showCommand');
      await showCommand(getTaskManager(), taskId);
    }
  },
  {
    name: 'create <title>',
    description: 'Create a new task',
    options: [
      ['-s, --status <status>', 'Task status'],
      ['-p, --priority <priority>', 'Task priority'],
      ['-t, --type <type>', 'Task type'],
      ['-c, --content <content>', 'Task content/description']
    ],
    action: async (title, options) => {
      const createCommand = await loadCommand('createCommand');
      await createCommand(getTaskManager(), title, options);
    }
  },
  {
    name: 'update <taskId>',
    description: 'Update an existing task',
    options: [
      ['-t, --title <title>', 'New title'],
      ['-s, --status <status>', 'New status'],
      ['-p, --priority <priority>', 'New priority'],
      ['--type <type>', 'New type']
    ],
    action: async (taskId, options) => {
      const updateCommand = await loadCommand('updateCommand');
      await updateCommand(getTaskManager(), taskId, options);
    }
  },
  {
    name: 'todo <taskId> <todoText> <checked>',
    description: 'Create or update a todo item within a task',
    action: async (taskId, todoText, checked) => {
      const todoCommand = await loadCommand('todoCommand');
      const isChecked = checked === 'true' || checked === '1';
      await todoCommand(getTaskManager(), taskId, todoText, isChecked);
    }
  },
  {
    name: 'hierarchical <taskId>',
    description: 'Analyze and manage hierarchical task structure',
    options: [
      ['-s, --structure', 'Show hierarchical structure'],
      ['-p, --progressive', 'Generate progressive todo steps']
    ],
    action: async (taskId, options) => {
      const hierarchicalCommand = await loadCommand('hierarchicalCommand');
      await hierarchicalCommand(taskId, options);
    }
  },
  {
    name: 'add-content <taskId>',
    description: 'Add content to an existing task',
    options: [
      ['-c, --content <content>', 'Content to add (markdown format)'],
      ['-t, --text <text>', 'Text content to add']
    ],
    action: async (taskId, options) => {
      const addContentCommand = await loadCommand('addContentCommand');
      await addContentCommand(getTaskManager(), taskId, options);
    }
  }
];

commands.forEach(cmd => {
  const command = program.command(cmd.name).description(cmd.description);
  if (cmd.options) {
    cmd.options.forEach(option => command.option(...option));
  }
  command.action(cmd.action);
});

program
  .argument('[instruction...]', 'Natural language instruction')
  .action(async (instruction) => {
    if (!instruction || instruction.length === 0) {
      program.help();
    } else {
      const naturalCommand = await loadCommand('naturalCommand');
      await naturalCommand(getTaskManager(), instruction);
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