import { extractTaskIdFromUrl } from '../../utils/urlParser.js';

export async function todoCommand(taskManager, taskIdOrUrl, todoText, checked) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    
    const result = await taskManager.updateTodoInContent(taskId, todoText, checked);
    
    if (result.success) {
      console.log(`✅ Todo "${todoText}" marked as ${checked ? 'completed' : 'uncompleted'}`);
    }
  } catch (error) {
    console.error('❌ Error updating todo:', error.message);
  }
}