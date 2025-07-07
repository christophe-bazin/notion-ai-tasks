import { TaskManager } from '../../core/TaskManager.js';
import { extractTaskIdFromUrl } from '../../utils/urlParser.js';
import { displaySuccess, displayError, displayInfo } from '../../utils/displayHelpers.js';

export async function hierarchicalCommand(taskIdOrUrl, options) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    const taskManager = new TaskManager();
    
    if (options.structure) {
      const structure = await taskManager.getHierarchicalStructure(taskId);
      console.log('📋 Hierarchical structure:');
      console.log(JSON.stringify(structure, null, 2));
      return;
    }
    
    if (options.progressive) {
      const progressiveSteps = await taskManager.generateProgressiveTodos(taskId);
      
      console.log('🎯 Progressive steps:');
      progressiveSteps.forEach((step, index) => {
        console.log(`\n${index + 1}. ${step.message}`);
        console.log('Update todo');
        step.todos.forEach(todo => {
          const checkbox = todo.checked ? '[x]' : '[ ]';
          console.log(`- ${checkbox} ${todo.text}`);
        });
      });
      return;
    }
    
    const task = await taskManager.getTask(taskId);
    const structure = await taskManager.getHierarchicalStructure(taskId);
    
    displayInfo('📋 Task: ' + task.title);
    displayInfo('🔄 Hierarchical structure detected');
    
    console.log('\n📊 Summary:');
    console.log(`- ${structure.sections.length} section(s)`);
    console.log(`- ${structure.todos.length} task(s) total`);
    console.log(`- ${structure.todos.filter(t => t.checked).length} task(s) completed`);
    
    if (structure.sections.length > 0) {
      console.log('\n📝 Sections:');
      structure.sections.forEach((section, index) => {
        console.log(`${index + 1}. ${section.title}`);
        console.log(`   - ${section.todos.length} task(s)`);
        console.log(`   - ${section.todos.filter(t => t.checked).length} completed`);
      });
    }
    
    displaySuccess('✅ Hierarchical analysis completed');
    
  } catch (error) {
    displayError('❌ Error during hierarchical analysis: ' + error.message);
  }
}