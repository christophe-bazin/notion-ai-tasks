import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

// Load config from local project directory
let config;
try {
  config = JSON.parse(fs.readFileSync('./notion-tasks.config.json', 'utf8'));
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