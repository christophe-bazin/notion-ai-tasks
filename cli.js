#!/usr/bin/env node

import { NotionTaskManager } from './index.js';
import { program } from 'commander';

const taskManager = new NotionTaskManager();

program
  .name('notion-tasks')
  .description('CLI to manage Notion tasks')
  .version('1.0.0');

program
  .command('list')
  .description('List all tasks')
  .action(async () => {
    try {
      const tasks = await taskManager.getTasks();
      console.log('\n📋 Your Notion Tasks:\n');
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title}`);
        console.log(`   Status: ${task.status} | Priority: ${task.priority} | Type: ${task.type}`);
        console.log(`   ID: ${task.id}\n`);
      });
    } catch (error) {
      console.error('❌ Error fetching tasks:', error.message);
    }
  });

program
  .command('create <title>')
  .description('Create a new task')
  .option('-s, --status <status>', 'Task status')
  .option('-p, --priority <priority>', 'Task priority')
  .option('-t, --type <type>', 'Task type')
  .action(async (title, options) => {
    try {
      const task = await taskManager.createTask({
        title,
        status: options.status,
        priority: options.priority,
        type: options.type
      });
      console.log('✅ Task created:', task.title);
    } catch (error) {
      console.error('❌ Error creating task:', error.message);
    }
  });

program
  .command('update <id>')
  .description('Update a task')
  .option('-s, --status <status>', 'New status')
  .option('-p, --priority <priority>', 'New priority')
  .option('-t, --type <type>', 'New type')
  .action(async (id, options) => {
    try {
      const updates = {};
      if (options.status) updates.status = options.status;
      if (options.priority) updates.priority = options.priority;
      if (options.type) updates.type = options.type;
      
      await taskManager.updateTask(id, updates);
      console.log('✅ Task updated successfully');
    } catch (error) {
      console.error('❌ Error updating task:', error.message);
    }
  });

program.parse();