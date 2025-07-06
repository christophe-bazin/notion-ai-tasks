import { extractTaskIdFromUrl } from '../../utils/urlParser.js';

export async function todoCommand(taskManager, taskIdOrUrl, todoText, checked) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    
    const result = await taskManager.updateTodoInContent(taskId, todoText, checked);
    
    if (result.success) {
      const cleanText = todoText.trim();
      
      if (result.created) {
        console.log(`✅ Todo "${cleanText}" created and marked as ${checked ? 'completed' : 'uncompleted'}`);
      } else {
        console.log(`✅ Todo "${cleanText}" marked as ${checked ? 'completed' : 'uncompleted'}`);
      }
    }
  } catch (error) {
    console.error('❌ Error updating todo:', error.message);
  }
}