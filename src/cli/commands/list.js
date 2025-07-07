import { displayTaskList } from '../../utils/displayHelpers.js';

export async function listCommand(taskManager, options) {
  try {
    const tasks = await taskManager.getTasks();
    displayTaskList(tasks);
  } catch (error) {
    console.error('❌ Error listing tasks:', error.message);
  }
}