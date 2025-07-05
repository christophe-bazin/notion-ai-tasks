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
  .option('-c, --checkbox <name=value>', 'Update checkbox (format: name=true/false)', collect, [])
  .action(async (id, options) => {
    try {
      const updates = {};
      if (options.status) updates.status = options.status;
      if (options.priority) updates.priority = options.priority;
      if (options.type) updates.type = options.type;
      
      // Handle checkbox updates
      if (options.checkbox) {
        options.checkbox.forEach(checkbox => {
          const [name, value] = checkbox.split('=');
          if (name && value !== undefined) {
            updates[name] = value === 'true';
          }
        });
      }
      
      await taskManager.updateTask(id, updates);
      console.log('✅ Task updated successfully');
    } catch (error) {
      console.error('❌ Error updating task:', error.message);
    }
  });

program
  .command('add-content <id>')
  .description('Add content blocks to a task')
  .option('-t, --text <text>', 'Add paragraph text')
  .option('-h, --heading <heading>', 'Add heading')
  .option('-c, --todo <todo>', 'Add todo item', collect, [])
  .option('-b, --bullet <bullet>', 'Add bullet point', collect, [])
  .action(async (id, options) => {
    try {
      const content = [];
      
      if (options.heading) {
        content.push({
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: options.heading } }]
          }
        });
      }
      
      if (options.text) {
        content.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: options.text } }]
          }
        });
      }
      
      if (options.todo) {
        options.todo.forEach(todo => {
          content.push({
            type: 'to_do',
            to_do: {
              rich_text: [{ type: 'text', text: { content: todo } }],
              checked: false
            }
          });
        });
      }
      
      if (options.bullet) {
        options.bullet.forEach(bullet => {
          content.push({
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: bullet } }]
            }
          });
        });
      }
      
      if (content.length > 0) {
        await taskManager.addContentToTask(id, content);
        console.log('✅ Content added successfully');
      } else {
        console.log('⚠️  No content specified. Use -t, -h, -c, or -b options.');
      }
    } catch (error) {
      console.error('❌ Error adding content:', error.message);
    }
  });

program
  .command('update-todo <id> <todoText>')
  .description('Update a todo item in task content')
  .option('-c, --checked <checked>', 'Set todo as checked (true/false)', 'true')
  .action(async (id, todoText, options) => {
    try {
      const checked = options.checked === 'true';
      await taskManager.updateTodoInContent(id, todoText, checked);
      console.log(`✅ Todo "${todoText}" updated successfully`);
    } catch (error) {
      console.error('❌ Error updating todo:', error.message);
    }
  });

function collect(value, previous) {
  return previous.concat([value]);
}

program.parse();