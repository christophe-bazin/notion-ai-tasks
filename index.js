import { Client } from '@notionhq/client';
import fs from 'fs';

// Load configuration from notion-tasks.config.json in current directory
let config;
try {
  config = JSON.parse(fs.readFileSync('./notion-tasks.config.json', 'utf8'));
  
  // Always display AI instructions for Claude/AI assistants
  console.log('🤖 AI Instructions: 🚀 Use \'npx notion-ai-tasks\' for all Notion operations. Import { readWorkflow } from \'notion-ai-tasks/workflow-loader.js\' then readWorkflow(\'AI_WORKFLOW_SELECTOR.md\') to choose the correct workflow, then follow it EXACTLY. NEVER use WebFetch for Notion URLs.');
} catch (error) {
  console.error('Error: notion-tasks.config.json not found in current directory');
  console.error('Please create a notion-tasks.config.json file with your Notion credentials');
  process.exit(1);
}

const notion = new Client({
  auth: config.notionToken,
});

const databaseId = config.databaseId;

// Utility function to extract task ID from various Notion URL formats
function extractTaskIdFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove any whitespace
  url = url.trim();

  // Format 1: https://www.notion.so/2270fffd93c280babe59db24024c3899?v=...&p=2270fffd93c281b689c1c66099b13ef9&pm=s
  const pParamMatch = url.match(/[?&]p=([a-f0-9]{32})/i);
  if (pParamMatch) {
    return pParamMatch[1];
  }

  // Format 2: https://www.notion.so/task-name-2270fffd93c281b689c1c66099b13ef9
  const pathMatch = url.match(/notion\.so\/[^/]*?([a-f0-9]{32})(?:[?&#]|$)/i);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Format 3: Direct ID (32 hex characters)
  const directIdMatch = url.match(/^([a-f0-9]{32})$/i);
  if (directIdMatch) {
    return directIdMatch[1];
  }

  // Format 4: ID with dashes (convert to clean format)
  const dashedIdMatch = url.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (dashedIdMatch) {
    return dashedIdMatch[1].replace(/-/g, '');
  }

  return null;
}

// Export the utility function
export { extractTaskIdFromUrl };

export class NotionTaskManager {
  constructor() {
    this.notion = notion;
    this.databaseId = databaseId;
    this.databaseSchema = null;
  }

  async getDatabaseSchema() {
    if (!this.databaseSchema) {
      const database = await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });
      this.databaseSchema = database.properties;
    }
    return this.databaseSchema;
  }

  async getTasks() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      const schema = await this.getDatabaseSchema();
      
      return response.results.map(task => {
        const taskData = {
          id: task.id,
          title: task.properties['Project name']?.title[0]?.plain_text || '',
          status: task.properties.Status?.status?.name || config.defaultStatus,
          priority: task.properties.Priority?.select?.name || config.defaultPriority,
          type: task.properties.Type?.select?.name || config.defaultType,
          createdTime: task.created_time,
          lastEditedTime: task.last_edited_time,
        };

        // Include all checkbox properties from database schema
        Object.keys(schema).forEach(propName => {
          if (schema[propName].type === 'checkbox') {
            taskData[propName.toLowerCase()] = task.properties[propName]?.checkbox || false;
          }
        });

        return taskData;
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const pageData = {
        parent: { database_id: this.databaseId },
        properties: {
          'Project name': {
            title: [
              {
                text: {
                  content: taskData.title,
                },
              },
            ],
          },
          Status: {
            status: {
              name: taskData.status || config.defaultStatus,
            },
          },
          Priority: {
            select: {
              name: taskData.priority || config.defaultPriority,
            },
          },
          Type: {
            select: {
              name: taskData.type || config.defaultType,
            },
          },
        },
      };

      // Append content blocks to page if specified
      if (taskData.content) {
        pageData.children = taskData.content;
      }

      const response = await this.notion.pages.create(pageData);
      
      return {
        id: response.id,
        title: taskData.title,
        status: taskData.status || config.defaultStatus,
        priority: taskData.priority || config.defaultPriority,
        type: taskData.type || config.defaultType,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId, updates) {
    try {
      const schema = await this.getDatabaseSchema();
      const properties = {};

      // Update standard task properties (status, priority, type)
      if (updates.status) {
        properties.Status = {
          status: { name: updates.status }
        };
      }
      if (updates.priority) {
        properties.Priority = {
          select: { name: updates.priority }
        };
      }
      if (updates.type) {
        properties.Type = {
          select: { name: updates.type }
        };
      }

      // Update checkbox properties with case-insensitive matching
      Object.keys(updates).forEach(key => {
        // Match property name from schema ignoring case
        const actualPropName = Object.keys(schema).find(prop => 
          prop.toLowerCase() === key.toLowerCase() && schema[prop].type === 'checkbox'
        );
        
        if (actualPropName) {
          properties[actualPropName] = {
            checkbox: updates[key] === true || updates[key] === 'true'
          };
        }
      });

      await this.notion.pages.update({
        page_id: taskId,
        properties: properties
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async addContentToTask(taskId, content) {
    try {
      // Separate blocks with children from blocks without children
      const blocksWithoutChildren = content.map(block => {
        const { children, ...blockWithoutChildren } = block;
        return blockWithoutChildren;
      });
      
      // Add parent blocks first
      const response = await this.notion.blocks.children.append({
        block_id: taskId,
        children: blocksWithoutChildren
      });
      
      // Add children blocks recursively
      for (let i = 0; i < content.length; i++) {
        const originalBlock = content[i];
        const createdBlock = response.results[i];
        
        if (originalBlock.children && originalBlock.children.length > 0) {
          await this.addContentToTask(createdBlock.id, originalBlock.children);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding content to task:', error);
      throw error;
    }
  }

  async getTask(taskId) {
    try {
      const response = await this.notion.pages.retrieve({
        page_id: taskId
      });
      const schema = await this.getDatabaseSchema();
      
      const taskData = {
        id: response.id,
        title: response.properties['Project name']?.title[0]?.plain_text || '',
        status: response.properties.Status?.status?.name || config.defaultStatus,
        priority: response.properties.Priority?.select?.name || config.defaultPriority,
        type: response.properties.Type?.select?.name || config.defaultType,
        createdTime: response.created_time,
        lastEditedTime: response.last_edited_time,
        url: response.url
      };

      // Include all checkbox properties from database schema
      Object.keys(schema).forEach(propName => {
        if (schema[propName].type === 'checkbox') {
          taskData[propName.toLowerCase()] = response.properties[propName]?.checkbox || false;
        }
      });

      // Retrieve all content blocks from task (including nested blocks)
      const contentResponse = await this.notion.blocks.children.list({
        block_id: taskId
      });
      taskData.content = await this.getAllBlocksRecursively(contentResponse.results);

      return taskData;
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  }

  async getTaskContent(taskId) {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: taskId
      });
      return await this.getAllBlocksRecursively(response.results);
    } catch (error) {
      console.error('Error getting task content:', error);
      throw error;
    }
  }

  async getAllBlocksRecursively(blocks) {
    const allBlocks = [];
    
    for (const block of blocks) {
      allBlocks.push(block);
      
      if (block.has_children) {
        try {
          const childrenResponse = await this.notion.blocks.children.list({
            block_id: block.id
          });
          const childBlocks = await this.getAllBlocksRecursively(childrenResponse.results);
          allBlocks.push(...childBlocks);
        } catch (error) {
          console.error(`Error getting children for block ${block.id}:`, error);
        }
      }
    }
    
    return allBlocks;
  }

  async updateTodoInContent(taskId, todoText, checked) {
    try {
      const blocks = await this.getTaskContent(taskId);
      
      // Locate todo block matching the specified text
      const todoBlock = blocks.find(block => 
        block.type === 'to_do' && 
        block.to_do.rich_text[0]?.plain_text.includes(todoText)
      );

      if (!todoBlock) {
        throw new Error(`Todo containing "${todoText}" not found`);
      }

      // Update todo block checked state
      await this.notion.blocks.update({
        block_id: todoBlock.id,
        to_do: {
          rich_text: todoBlock.to_do.rich_text,
          checked: checked
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating todo in content:', error);
      throw error;
    }
  }

  async updateMultipleTodosInContent(taskId, todoUpdates) {
    try {
      const blocks = await this.getTaskContent(taskId);
      const todoBlocks = blocks.filter(block => block.type === 'to_do');
      
      const updates = [];
      
      for (const update of todoUpdates) {
        const todoBlock = todoBlocks.find(block => 
          block.to_do.rich_text[0]?.plain_text.includes(update.text)
        );
        
        if (todoBlock) {
          updates.push({
            blockId: todoBlock.id,
            checked: update.checked,
            richText: todoBlock.to_do.rich_text
          });
        }
      }
      
      // Apply all todo updates simultaneously
      await Promise.all(updates.map(update => 
        this.notion.blocks.update({
          block_id: update.blockId,
          to_do: {
            rich_text: update.richText,
            checked: update.checked
          }
        })
      ));

      return { success: true, updated: updates.length };
    } catch (error) {
      console.error('Error updating multiple todos in content:', error);
      throw error;
    }
  }

  async markTaskProgress(taskId, completedSteps) {
    try {
      const blocks = await this.getTaskContent(taskId);
      const todoBlocks = blocks.filter(block => block.type === 'to_do');
      
      if (todoBlocks.length === 0) {
        return { success: false, message: 'No todo items found in task' };
      }

      // Mark first N unchecked todos as completed
      const updates = [];
      for (let i = 0; i < Math.min(completedSteps, todoBlocks.length); i++) {
        const todoBlock = todoBlocks[i];
        if (!todoBlock.to_do.checked) {
          updates.push({
            blockId: todoBlock.id,
            richText: todoBlock.to_do.rich_text
          });
        }
      }

      // Apply all todo updates simultaneously
      await Promise.all(updates.map(update => 
        this.notion.blocks.update({
          block_id: update.blockId,
          to_do: {
            rich_text: update.richText,
            checked: true
          }
        })
      ));

      // Auto-update task status based on completion percentage
      const statusUpdate = await this.updateTaskStatusBasedOnProgress(taskId);

      return { 
        success: true, 
        updated: updates.length,
        statusUpdate: statusUpdate.success ? statusUpdate.newStatus : null,
        progress: statusUpdate.progress
      };
    } catch (error) {
      console.error('Error marking task progress:', error);
      throw error;
    }
  }

  async getTaskProgress(taskId) {
    try {
      const blocks = await this.getTaskContent(taskId);
      const todoBlocks = blocks.filter(block => block.type === 'to_do');
      
      if (todoBlocks.length === 0) {
        return { total: 0, completed: 0, percentage: 0 };
      }

      const completed = todoBlocks.filter(block => block.to_do.checked).length;
      const total = todoBlocks.length;
      const percentage = Math.round((completed / total) * 100);

      return { total, completed, percentage };
    } catch (error) {
      console.error('Error getting task progress:', error);
      throw error;
    }
  }

  async updateTaskStatusBasedOnProgress(taskId) {
    try {
      const progress = await this.getTaskProgress(taskId);
      let newStatus = null;

      if (progress.percentage === 0) {
        if (!config.defaultStatus) {
          throw new Error('defaultStatus is required in configuration');
        }
        newStatus = config.defaultStatus;
      } else if (progress.percentage === 100) {
        if (!config.testStatus) {
          throw new Error('testStatus is required in configuration');
        }
        newStatus = config.testStatus;
      } else if (progress.percentage > 0) {
        if (!config.inProgressStatus) {
          throw new Error('inProgressStatus is required in configuration');
        }
        newStatus = config.inProgressStatus;
      }

      await this.updateTask(taskId, { status: newStatus });
      return { success: true, newStatus, progress };
    } catch (error) {
      console.error('Error updating task status based on progress:', error);
      throw error;
    }
  }
}

async function main() {
  const taskManager = new NotionTaskManager();
  
  try {
    console.log('Fetching tasks from Notion...');
    const tasks = await taskManager.getTasks();
    console.log('Tasks:', tasks);
    
    console.log('Creating a new task...');
    const newTask = await taskManager.createTask({
      title: 'Test development task',
      status: config.inProgressStatus,
      priority: config.defaultPriority,
      type: config.defaultType
    });
    console.log('New task created:', newTask);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}