import { extractTaskIdFromUrl } from '../../utils/urlParser.js';

export async function updateCommand(taskManager, taskIdOrUrl, options) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    const updates = {};

    if (options.title) updates.title = options.title;
    if (options.status) updates.status = options.status;
    if (options.priority) updates.priority = options.priority;
    if (options.type) updates.type = options.type;

    const result = await taskManager.updateTask(taskId, updates);
    
    if (result.success) {
      console.log('✅ Task updated successfully');
    }
  } catch (error) {
    console.error('❌ Error updating task:', error.message);
  }
}