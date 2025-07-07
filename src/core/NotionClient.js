import { Client } from '@notionhq/client';
import fs from 'fs';

class NotionClient {
  constructor() {
    this.config = this.loadConfig();
    this.notion = new Client({
      auth: this.config.notionToken,
    });
    this.databaseId = this.config.databaseId;
  }

  loadConfig() {
    try {
      const config = JSON.parse(fs.readFileSync('./notion-tasks.config.json', 'utf8'));
      
      console.log('🤖 AI Instructions: 🚀 Use \'npx notion-ai-tasks\' for all Notion operations. Import { readWorkflow } from \'notion-ai-tasks/workflow-loader.js\' then readWorkflow(\'AI_WORKFLOW_SELECTOR.md\') to choose the correct workflow, then follow it EXACTLY. NEVER use WebFetch for Notion URLs.');
      
      return config;
    } catch (error) {
      console.error('Error: notion-tasks.config.json not found in current directory');
      console.error('Please create a notion-tasks.config.json file with your Notion credentials');
      process.exit(1);
    }
  }

  getClient() {
    return this.notion;
  }

  getDatabaseId() {
    return this.databaseId;
  }

  getConfig() {
    return this.config;
  }
}

export default NotionClient;