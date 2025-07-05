import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

// Load config from local project directory
let config;
try {
  config = JSON.parse(fs.readFileSync('./notion-tasks.config.json', 'utf8'));
  
  // Show AI instructions if present
  if (config._aiInstructions) {
    console.log('🤖 AI Instructions:', config._aiInstructions);
  }
} catch (error) {
  console.error('Error: notion-tasks.config.json not found in current directory');
  console.error('Please create a notion-tasks.config.json file with your Notion credentials');
  process.exit(1);
}

const notion = new Client({
  auth: config.notionToken,
});

const databaseId = config.databaseId;

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

        // Add all checkbox properties
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

      // Add content if provided
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

      // Handle standard properties
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

      // Handle checkbox properties
      Object.keys(updates).forEach(key => {
        // Find the actual property name in schema (case insensitive)
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
      await this.notion.blocks.children.append({
        block_id: taskId,
        children: content
      });
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

      // Add all checkbox properties
      Object.keys(schema).forEach(propName => {
        if (schema[propName].type === 'checkbox') {
          taskData[propName.toLowerCase()] = response.properties[propName]?.checkbox || false;
        }
      });

      // Get content blocks
      const contentResponse = await this.notion.blocks.children.list({
        block_id: taskId
      });
      taskData.content = contentResponse.results;

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
      return response.results;
    } catch (error) {
      console.error('Error getting task content:', error);
      throw error;
    }
  }

  async updateTodoInContent(taskId, todoText, checked) {
    try {
      const blocks = await this.getTaskContent(taskId);
      
      // Find the todo block by text content
      const todoBlock = blocks.find(block => 
        block.type === 'to_do' && 
        block.to_do.rich_text[0]?.plain_text.includes(todoText)
      );

      if (!todoBlock) {
        throw new Error(`Todo containing "${todoText}" not found`);
      }

      // Update the todo block
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
      
      // Execute all updates in parallel
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

      // Mark specified number of steps as completed
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

      // Execute updates
      await Promise.all(updates.map(update => 
        this.notion.blocks.update({
          block_id: update.blockId,
          to_do: {
            rich_text: update.richText,
            checked: true
          }
        })
      ));

      // Update task status based on progress
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
        newStatus = config.statuses.find(s => s.includes('Not Started') || s.includes('To Do')) || config.statuses[0];
      } else if (progress.percentage === 100) {
        newStatus = config.statuses.find(s => s.includes('Done') || s.includes('Completed')) || config.statuses[config.statuses.length - 1];
      } else if (progress.percentage > 0) {
        newStatus = config.statuses.find(s => s.includes('In Progress') || s.includes('Working')) || config.statuses[1];
      }

      if (newStatus) {
        await this.updateTask(taskId, { status: newStatus });
        return { success: true, newStatus, progress };
      }

      return { success: false, message: 'No appropriate status found' };
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
      status: 'In Progress',
      priority: 'High',
      type: 'Feature'
    });
    console.log('New task created:', newTask);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}