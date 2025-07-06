import { parseNaturalLanguage } from '../../utils/nlpParser.js';
import { displayTaskList } from '../../utils/displayHelpers.js';

export async function naturalCommand(taskManager, instruction) {
  try {
    const text = instruction.join(' ');
    console.log('🤖 Processing:', text);
    
    const parsed = parseNaturalLanguage(text);
    
    if (!parsed) {
      console.log('❌ Could not understand instruction. Examples:');
      console.log('  - "create Fix login bug"');
      console.log('  - "update abc123 to In Progress"');
      console.log('  - "list tasks"');
      console.log('  - "work on https://notion.so/task-url"');
      return;
    }
    
    switch (parsed.action) {
      case 'create':
        const task = await taskManager.createTask({ title: parsed.title });
        console.log('✅ Task created:', task.title);
        break;
        
      case 'update':
        await taskManager.updateTask(parsed.id, { status: parsed.status });
        console.log('✅ Task updated successfully');
        break;
        
      case 'list':
        const tasks = await taskManager.getTasks();
        displayTaskList(tasks);
        break;
        
      case 'work':
        console.log('🔗 Processing task from URL:', parsed.url);
        console.log('💡 URL processing not implemented yet');
        break;
        
      default:
        console.log('❌ Unknown action');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}