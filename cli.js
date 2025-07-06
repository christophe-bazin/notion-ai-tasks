#!/usr/bin/env node

import { NotionTaskManager, extractTaskIdFromUrl } from './index.js';
import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const taskManager = new NotionTaskManager();

// Function to display content with proper hierarchical indentation
function displayContentWithHierarchy(blocks) {
  let currentDepth = 0;
  
  blocks.forEach((block, index) => {
    const indent = '  '.repeat(currentDepth);
    
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text && block.paragraph.rich_text.length > 0) {
          console.log(`${indent}${block.paragraph.rich_text[0].plain_text}`);
        }
        break;
      case 'heading_1':
        console.log(`${indent}# ${block.heading_1.rich_text[0]?.plain_text || ''}`);
        break;
      case 'heading_2':
        console.log(`${indent}## ${block.heading_2.rich_text[0]?.plain_text || ''}`);
        break;
      case 'heading_3':
        console.log(`${indent}### ${block.heading_3.rich_text[0]?.plain_text || ''}`);
        break;
      case 'bulleted_list_item':
        console.log(`${indent}- ${block.bulleted_list_item.rich_text[0]?.plain_text || ''}`);
        break;
      case 'numbered_list_item':
        console.log(`${indent}${index + 1}. ${block.numbered_list_item.rich_text[0]?.plain_text || ''}`);
        break;
      case 'to_do':
        const checked = block.to_do.checked ? '☑' : '☐';
        const text = block.to_do.rich_text[0]?.plain_text || '';
        
        // Determine depth based on content patterns
        const isParent = text.toLowerCase().includes('parent') || text.toLowerCase().includes('tâche parent');
        const isChild = text.toLowerCase().includes('sous-') || text.toLowerCase().includes('sub-');
        const isSubChild = text.toLowerCase().includes('sous-sous-') || text.toLowerCase().includes('sub-sub-');
        
        if (isSubChild) {
          currentDepth = 2;
        } else if (isChild) {
          currentDepth = 1;
        } else if (isParent) {
          currentDepth = 0;
        }
        
        const finalIndent = '  '.repeat(currentDepth);
        console.log(`${finalIndent}${checked} ${text}`);
        break;
      case 'code':
        console.log(`${indent}\`\`\`${block.code.language || ''}`);
        console.log(`${indent}${block.code.rich_text[0]?.plain_text || ''}`);
        console.log(`${indent}\`\`\``);
        break;
      case 'quote':
        console.log(`${indent}> ${block.quote.rich_text[0]?.plain_text || ''}`);
        break;
      default:
        console.log(`${indent}[${block.type}] ${JSON.stringify(block[block.type])}`);
    }
  });
}

program
  .name('notion-tasks')
  .description('CLI to manage Notion tasks')
  .version(packageJson.version);

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
  .command('get <id>')
  .description('Get task details by ID or URL')
  .action(async (id) => {
    try {
      // Extract task ID from URL if needed
      const taskId = extractTaskIdFromUrl(id) || id;
      const task = await taskManager.getTask(taskId);
      console.log('\n📄 Task Details:\n');
      console.log(`Title: ${task.title}`);
      console.log(`Status: ${task.status} | Priority: ${task.priority} | Type: ${task.type}`);
      console.log(`ID: ${task.id}`);
      console.log(`URL: ${task.url}`);
      console.log(`Created: ${new Date(task.createdTime).toLocaleDateString()}`);
      console.log(`Last edited: ${new Date(task.lastEditedTime).toLocaleDateString()}`);
      
      // Display content blocks with hierarchical structure
      if (task.content && task.content.length > 0) {
        console.log('\n📝 Content:\n');
        displayContentWithHierarchy(task.content);
      }
    } catch (error) {
      console.error('❌ Error fetching task:', error.message);
    }
  });

program
  .command('create <title>')
  .description('Create a new task')
  .option('-s, --status <status>', 'Task status')
  .option('-p, --priority <priority>', 'Task priority')
  .option('-t, --type <type>', 'Task type')
  .option('-d, --description <description>', 'Task description')
  .option('-c, --content <content>', 'Task content (markdown format)')
  .action(async (title, options) => {
    try {
      const taskData = {
        title,
        status: options.status,
        priority: options.priority,
        type: options.type
      };

      // Handle description by converting to content
      if (options.description) {
        const descriptionContent = [{
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: options.description } }]
          }
        }];
        taskData.content = descriptionContent;
      }

      // Parse content if provided (overrides description)
      if (options.content) {
        const content = parseMarkdownToBlocks(options.content);
        taskData.content = content;
      }

      const task = await taskManager.createTask(taskData);
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
  .option('--content <content>', 'Add content to task (markdown format)')
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
      
      // Add content if provided
      if (options.content) {
        const content = parseMarkdownToBlocks(options.content);
        await taskManager.addContentToTask(id, content);
        console.log('✅ Content added successfully');
      }
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

program
  .command('progress <id>')
  .description('Show task progress')
  .action(async (id) => {
    try {
      const progress = await taskManager.getTaskProgress(id);
      console.log(`📊 Task Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)`);
    } catch (error) {
      console.error('❌ Error getting task progress:', error.message);
    }
  });

program
  .command('mark-progress <id> <steps>')
  .description('Mark progress by completing specified number of steps')
  .action(async (id, steps) => {
    try {
      const result = await taskManager.markTaskProgress(id, parseInt(steps));
      if (result.success) {
        console.log(`✅ Marked ${result.updated} steps as completed`);
        
        if (result.statusUpdate) {
          console.log(`📝 Status automatically updated to: ${result.statusUpdate}`);
        }
        
        // Show updated progress
        console.log(`📊 New Progress: ${result.progress.completed}/${result.progress.total} (${result.progress.percentage}%)`);
      } else {
        console.log(`⚠️  ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error marking progress:', error.message);
    }
  });

program
  .command('update-multiple-todos <id>')
  .description('Update multiple todos in task content')
  .option('-u, --updates <updates>', 'JSON array of updates (e.g., [{"text":"task1","checked":true}])')
  .action(async (id, options) => {
    try {
      if (!options.updates) {
        console.log('❌ Please provide updates using -u option');
        console.log('Example: -u \'[{"text":"Setup database","checked":true},{"text":"Create API","checked":false}]\'');
        return;
      }
      
      const updates = JSON.parse(options.updates);
      const result = await taskManager.updateMultipleTodosInContent(id, updates);
      console.log(`✅ Updated ${result.updated} todos successfully`);
      
      // Update status based on progress
      const statusUpdate = await taskManager.updateTaskStatusBasedOnProgress(id);
      if (statusUpdate.success) {
        console.log(`📝 Status automatically updated to: ${statusUpdate.newStatus}`);
        console.log(`📊 Progress: ${statusUpdate.progress.completed}/${statusUpdate.progress.total} (${statusUpdate.progress.percentage}%)`);
      }
    } catch (error) {
      console.error('❌ Error updating multiple todos:', error.message);
    }
  });

program
  .command('update-status <id>')
  .description('Update task status based on current progress')
  .action(async (id) => {
    try {
      const result = await taskManager.updateTaskStatusBasedOnProgress(id);
      if (result.success) {
        console.log(`✅ Status updated to: ${result.newStatus}`);
        console.log(`📊 Progress: ${result.progress.completed}/${result.progress.total} (${result.progress.percentage}%)`);
      } else {
        console.log(`⚠️  ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error.message);
    }
  });

// Parse markdown content to Notion blocks
function parseMarkdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Headings
    if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3) } }]
        }
      });
    }
    // Todo items
    else if (line.startsWith('- [ ] ')) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: line.substring(6) } }],
          checked: false
        }
      });
    }
    // Bullet points
    else if (line.startsWith('- ')) {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    }
    // Regular paragraphs
    else {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line } }]
        }
      });
    }
  }
  
  return blocks;
}

// Parse natural language commands
function parseNaturalLanguage(text) {
  const lower = text.toLowerCase();
  
  // Create task patterns
  if (lower.includes('create') || lower.includes('créer')) {
    const match = text.match(/(?:create|créer)(?:\s+(?:task|tâche|une tâche))?\s+(.+)/i);
    if (match) {
      return { action: 'create', title: match[1].trim() };
    }
  }
  
  // Update task patterns
  if (lower.includes('update') || lower.includes('modifier')) {
    const match = text.match(/(?:update|modifier)(?:\s+(?:task|tâche))?\s+(\S+)(?:\s+(?:to|à|vers))?\s+(.+)/i);
    if (match) {
      return { action: 'update', id: match[1], status: match[2].trim() };
    }
  }
  
  // List tasks patterns
  if (lower.includes('list') || lower.includes('lister') || lower.includes('afficher')) {
    return { action: 'list' };
  }
  
  // Work on URL patterns
  if (lower.includes('work on') || lower.includes('travailler sur') || text.includes('http')) {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return { action: 'work', url: urlMatch[0] };
    }
  }
  
  return null;
}

// Handle natural language as default command
program
  .argument('[instruction...]', 'Natural language instruction')
  .action(async (instruction) => {
    if (!instruction || instruction.length === 0) {
      program.help();
    } else {
      const text = instruction.join(' ');
    
    try {
      console.log('🤖 Processing:', text);
      
      const parsed = parseNaturalLanguage(text);
      
      if (!parsed) {
        console.log('❌ Could not understand instruction. Examples:');
        console.log('  - "create Fix login bug"');
        console.log('  - "update abc123 to In Progress"');
        console.log('  - "list tasks"');
        console.log('  - "work on https://notion.so/task-url"');
        return;
      }
      
      switch (parsed.action) {
        case 'create':
          const task = await taskManager.createTask({ title: parsed.title });
          console.log('✅ Task created:', task.title);
          break;
          
        case 'update':
          await taskManager.updateTask(parsed.id, { status: parsed.status });
          console.log('✅ Task updated successfully');
          break;
          
        case 'list':
          const tasks = await taskManager.getTasks();
          console.log('\n📋 Your Notion Tasks:\n');
          tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.title}`);
            console.log(`   Status: ${task.status} | Priority: ${task.priority} | Type: ${task.type}`);
            console.log(`   ID: ${task.id}\n`);
          });
          break;
          
        case 'work':
          console.log('🔗 Processing task from URL:', parsed.url);
          console.log('💡 URL processing not implemented yet');
          break;
          
        default:
          console.log('❌ Unknown action');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    }
  });

function collect(value, previous) {
  return previous.concat([value]);
}

program.parse();