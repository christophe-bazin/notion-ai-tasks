export { TaskManager } from './src/core/TaskManager.js';
export { ContentManager } from './src/core/ContentManager.js';
export { default as NotionClient } from './src/core/NotionClient.js';
export { extractTaskIdFromUrl } from './src/utils/urlParser.js';
export { displayContentWithHierarchy, displayTaskInfo, displayTaskList } from './src/utils/displayHelpers.js';
export { parseNaturalLanguage } from './src/utils/nlpParser.js';

export { listCommand } from './src/cli/commands/list.js';
export { showCommand } from './src/cli/commands/show.js';
export { createCommand } from './src/cli/commands/create.js';
export { updateCommand } from './src/cli/commands/update.js';
export { todoCommand } from './src/cli/commands/todo.js';
export { naturalCommand } from './src/cli/commands/natural.js';

// Backward compatibility
export { TaskManager as NotionTaskManager } from './src/core/TaskManager.js';