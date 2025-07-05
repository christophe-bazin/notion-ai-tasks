import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

export class NotionTaskManager {
  constructor() {
    this.notion = notion;
    this.databaseId = databaseId;
  }

  async getTasks() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      
      return response.results.map(task => ({
        id: task.id,
        title: task.properties.Name?.title[0]?.plain_text || '',
        status: task.properties.Status?.select?.name || config.defaultStatus,
        priority: task.properties.Priority?.select?.name || config.defaultPriority,
        type: task.properties.Type?.select?.name || config.defaultType,
        createdTime: task.created_time,
        lastEditedTime: task.last_edited_time,
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: taskData.title,
                },
              },
            ],
          },
          Status: {
            select: {
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
      });
      
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