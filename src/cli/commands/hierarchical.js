import { TaskManager } from '../../core/TaskManager.js';
import { extractTaskIdFromUrl } from '../../utils/urlParser.js';
import { displaySuccess, displayError, displayInfo } from '../../utils/displayHelpers.js';

export async function hierarchicalCommand(taskIdOrUrl, options) {
  try {
    const taskId = extractTaskIdFromUrl(taskIdOrUrl) || taskIdOrUrl;
    const taskManager = new TaskManager();
    
    if (options.structure) {
      const structure = await taskManager.getHierarchicalStructure(taskId);
      console.log('📋 Structure hiérarchique:');
      console.log(JSON.stringify(structure, null, 2));
      return;
    }
    
    if (options.progressive) {
      const language = options.language || 'fr';
      const progressiveSteps = await taskManager.generateProgressiveTodos(taskId, language);
      
      console.log('🎯 Étapes progressives:');
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
    
    displayInfo('📋 Tâche: ' + task.title);
    displayInfo('🔄 Structure hiérarchique détectée');
    
    console.log('\n📊 Résumé:');
    console.log(`- ${structure.sections.length} section(s)`);
    console.log(`- ${structure.todos.length} tâche(s) au total`);
    console.log(`- ${structure.todos.filter(t => t.checked).length} tâche(s) terminée(s)`);
    
    if (structure.sections.length > 0) {
      console.log('\n📝 Sections:');
      structure.sections.forEach((section, index) => {
        console.log(`${index + 1}. ${section.title}`);
        console.log(`   - ${section.todos.length} tâche(s)`);
        console.log(`   - ${section.todos.filter(t => t.checked).length} terminée(s)`);
      });
    }
    
    displaySuccess('✅ Analyse hiérarchique terminée');
    
  } catch (error) {
    displayError('❌ Erreur lors de l\'analyse hiérarchique: ' + error.message);
  }
}