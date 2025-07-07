import NotionClient from './NotionClient.js';
import { ContentManager } from './ContentManager.js';
import { parseMarkdownToNotionBlocks } from '../utils/markdownParser.js';
import { HierarchicalTaskParser } from '../utils/hierarchicalTaskParser.js';

export class TaskManager {
  constructor() {
    this.notionClient = new NotionClient();
    this.contentManager = new ContentManager(this.notionClient);
    this.hierarchicalParser = new HierarchicalTaskParser();
    this.notion = this.notionClient.getClient();
    this.databaseId = this.notionClient.getDatabaseId();
    this.config = this.notionClient.getConfig();
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
          status: task.properties.Status?.status?.name || this.config.defaultStatus,
          priority: task.properties.Priority?.select?.name || this.config.defaultPriority,
          type: task.properties.Type?.select?.name || this.config.defaultType,
          createdTime: task.created_time,
          lastEditedTime: task.last_edited_time,
          url: task.url
        };

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
              name: taskData.status || this.config.defaultStatus,
            },
          },
          Priority: {
            select: {
              name: taskData.priority || this.config.defaultPriority,
            },
          },
          Type: {
            select: {
              name: taskData.type || this.config.defaultType,
            },
          },
        },
      };


      if (taskData.content) {
        pageData.children = parseMarkdownToNotionBlocks(taskData.content);
      }

      const response = await this.notion.pages.create(pageData);
      
      return {
        id: response.id,
        title: taskData.title,
        status: taskData.status || this.config.defaultStatus,
        priority: taskData.priority || this.config.defaultPriority,
        type: taskData.type || this.config.defaultType,
        url: response.url
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId, updates) {
    try {
      const properties = {};
      
      if (updates.title) {
        properties['Project name'] = {
          title: [
            {
              text: {
                content: updates.title,
              },
            },
          ],
        };
      }

      if (updates.status) {
        properties.Status = {
          status: {
            name: updates.status,
          },
        };
      }

      if (updates.priority) {
        properties.Priority = {
          select: {
            name: updates.priority,
          },
        };
      }

      if (updates.type) {
        properties.Type = {
          select: {
            name: updates.type,
          },
        };
      }

      const schema = await this.getDatabaseSchema();
      Object.keys(schema).forEach(propName => {
        if (schema[propName].type === 'checkbox' && updates[propName.toLowerCase()] !== undefined) {
          properties[propName] = {
            checkbox: updates[propName.toLowerCase()]
          };
        }
      });

      await this.notion.pages.update({
        page_id: taskId,
        properties: properties,
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
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
        status: response.properties.Status?.status?.name || this.config.defaultStatus,
        priority: response.properties.Priority?.select?.name || this.config.defaultPriority,
        type: response.properties.Type?.select?.name || this.config.defaultType,
        createdTime: response.created_time,
        lastEditedTime: response.last_edited_time,
        url: response.url
      };

      Object.keys(schema).forEach(propName => {
        if (schema[propName].type === 'checkbox') {
          taskData[propName.toLowerCase()] = response.properties[propName]?.checkbox || false;
        }
      });

      taskData.content = await this.contentManager.getTaskContent(taskId);

      return taskData;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async addContentToTask(taskId, content) {
    return await this.contentManager.addContentToTask(taskId, content);
  }

  async getTaskContent(taskId) {
    return await this.contentManager.getTaskContent(taskId);
  }

  async updateTodoInContent(taskId, todoText, checked) {
    return await this.contentManager.updateTodoInContent(taskId, todoText, checked);
  }

  async getHierarchicalStructure(taskId) {
    try {
      const content = await this.contentManager.getTaskContent(taskId);
      return this.hierarchicalParser.parseHierarchicalContent(content);
    } catch (error) {
      console.error('Error getting hierarchical structure:', error);
      throw error;
    }
  }

  async generateProgressiveTodos(taskId, language = 'fr') {
    try {
      const structure = await this.getHierarchicalStructure(taskId);
      return this.hierarchicalParser.generateProgressiveTodos(structure, language);
    } catch (error) {
      console.error('Error generating progressive todos:', error);
      throw error;
    }
  }

  generateContextualMessage(currentStep, completedTasks, language = 'fr') {
    return this.hierarchicalParser.generateContextualMessage(currentStep, completedTasks, language);
  }
}