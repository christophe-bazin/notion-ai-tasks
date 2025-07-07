import { extractTaskIdFromUrl } from '../../utils/urlParser.js';
import { parseMarkdownToNotionBlocks } from '../../utils/markdownParser.js';

export async function addContentCommand(taskManager, taskIdOrUrl, options) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    
    if (!options.content && !options.text) {
      console.error('❌ Error: Either --content (-c) or --text (-t) option is required');
      return;
    }

    let content = options.content || options.text;
    
    // Parse markdown to Notion blocks
    const blocks = parseMarkdownToNotionBlocks(content);
    
    if (blocks.length === 0) {
      console.error('❌ Error: No valid content to add');
      return;
    }

    // Add content to task
    const result = await taskManager.addContentToTask(taskId, blocks);
    
    if (result.success) {
      console.log('✅ Content added successfully to task');
      console.log(`   Task ID: ${taskId}`);
      console.log(`   Added ${blocks.length} content block(s)`);
    } else {
      console.error('❌ Error: Failed to add content to task');
    }
    
  } catch (error) {
    console.error('❌ Error adding content to task:', error.message);
  }
}