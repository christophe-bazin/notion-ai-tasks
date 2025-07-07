import { displayTaskInfo, displayContentWithHierarchy } from '../../utils/displayHelpers.js';
import { extractTaskIdFromUrl } from '../../utils/urlParser.js';

export async function showCommand(taskManager, taskIdOrUrl) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    const task = await taskManager.getTask(taskId);
    
    displayTaskInfo(task);
    
    if (task.content && task.content.length > 0) {
      console.log('\n📝 Content:\n');
      displayContentWithHierarchy(task.content);
    }
  } catch (error) {
    console.error('❌ Error fetching task:', error.message);
  }
}