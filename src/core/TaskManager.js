import NotionClient from './NotionClient.js';
import { ContentManager } from './ContentManager.js';
import { parseMarkdownToNotionBlocks } from '../utils/markdownParser.js';
import { HierarchicalTaskParser } from '../utils/hierarchicalTaskParser.js';
import { notionCache } from '../utils/cache.js';

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
      const cacheKey = `schema:${this.databaseId}`;
      let cached = notionCache.get(cacheKey);
      
      if (!cached) {
        const database = await this.notion.databases.retrieve({
          database_id: this.databaseId,
        });
        cached = database.properties;
        notionCache.set(cacheKey, cached);
      }
      
      this.databaseSchema = cached;
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

      // Invalidate cache for this task
      notionCache.invalidatePrefix(`task:${taskId}`);

      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async getTask(taskId) {
    try {
      const cacheKey = `task:${taskId}`;
      let response = notionCache.get(cacheKey);
      
      if (!response) {
        response = await this.notion.pages.retrieve({
          page_id: taskId
        });
        notionCache.set(cacheKey, response);
      }
      
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
      
      try {
        taskData.hierarchicalStructure = await this.getHierarchicalStructure(taskId);
        taskData.progressiveSteps = await this.generateProgressiveTodos(taskId);
      } catch (error) {
        console.warn('Could not analyze hierarchical structure:', error.message);
        taskData.hierarchicalStructure = null;
        taskData.progressiveSteps = null;
      }

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
    const result = await this.contentManager.updateTodoInContent(taskId, todoText, checked);
    
    // Auto-update task status based on progress after todo change
    try {
      const statusResult = await this.updateTaskStatusBasedOnProgress(taskId);
      result.statusUpdate = statusResult;
    } catch (error) {
      console.warn('Failed to auto-update task status:', error.message);
      result.statusUpdate = { success: false, error: error.message };
    }
    
    return result;
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

  async generateProgressiveTodos(taskId) {
    try {
      const structure = await this.getHierarchicalStructure(taskId);
      return this.hierarchicalParser.generateProgressiveTodos(structure);
    } catch (error) {
      console.error('Error generating progressive todos:', error);
      throw error;
    }
  }

  generateContextualMessage(currentStep, completedTasks) {
    return this.hierarchicalParser.generateContextualMessage(currentStep, completedTasks);
  }

  async getTaskProgress(taskId) {
    try {
      const content = await this.contentManager.getTaskContent(taskId);
      const todos = content.filter(block => block.type === 'to_do');
      
      if (todos.length === 0) {
        return { total: 0, completed: 0, percentage: 0 };
      }
      
      const completed = todos.filter(todo => todo.to_do.checked).length;
      const percentage = Math.round((completed / todos.length) * 100);
      
      return { total: todos.length, completed, percentage };
    } catch (error) {
      console.error('Error getting task progress:', error);
      throw error;
    }
  }

  async markTaskProgress(taskId, steps) {
    try {
      const results = [];
      for (const step of steps) {
        const result = await this.updateTodoInContent(taskId, step.text, step.checked);
        results.push(result);
      }
      return { success: true, results };
    } catch (error) {
      console.error('Error marking task progress:', error);
      throw error;
    }
  }

  async updateTaskStatusBasedOnProgress(taskId) {
    try {
      const progress = await this.getTaskProgress(taskId);
      const currentTask = await this.getTask(taskId);
      
      // Only auto-update if task has todos
      if (progress.total === 0) {
        return { success: true, statusChanged: false, reason: 'No todos found' };
      }
      
      let newStatus = currentTask.status;
      let statusChanged = false;
      
      // Case-insensitive status comparison
      const currentStatusLower = currentTask.status.toLowerCase();
      const defaultStatusLower = this.config.defaultStatus?.toLowerCase() || '';
      const inProgressStatusLower = this.config.inProgressStatus?.toLowerCase() || '';
      
      // Auto-progression rules
      if (currentStatusLower === defaultStatusLower && progress.percentage > 0) {
        // Start progress when first todo is checked
        if (this.config.inProgressStatus) {
          newStatus = this.config.inProgressStatus;
          statusChanged = true;
        }
      } else if (currentStatusLower === inProgressStatusLower && progress.percentage === 100) {
        // Move to Test when all todos are completed - with fallback to completionStatus
        if (this.config.testStatus) {
          newStatus = this.config.testStatus;
          statusChanged = true;
        } else if (this.config.completionStatus) {
          // Fallback: if no testStatus configured, skip auto-progression to Done
          console.warn('Warning: testStatus not configured. Task remains in progress for manual review.');
          return { 
            success: true, 
            statusChanged: false, 
            reason: 'testStatus not configured - manual review required',
            progress: progress
          };
        }
      }
      
      if (statusChanged) {
        try {
          await this.updateTask(taskId, { status: newStatus });
          return { 
            success: true, 
            statusChanged: true, 
            oldStatus: currentTask.status,
            newStatus: newStatus,
            progress: progress
          };
        } catch (error) {
          if (error.message.includes('invalid select')) {
            console.error(`Error: Status "${newStatus}" does not exist in Notion database. Please add it to the Status property options.`);
            return { 
              success: false, 
              statusChanged: false, 
              error: `Status "${newStatus}" not found in Notion database`,
              progress: progress
            };
          }
          throw error;
        }
      }
      
      return { success: true, statusChanged: false, progress: progress };
    } catch (error) {
      console.error('Error updating task status based on progress:', error);
      throw error;
    }
  }
}