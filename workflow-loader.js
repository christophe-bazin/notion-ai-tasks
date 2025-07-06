import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Toujours utiliser le chemin du fichier workflow-loader.js lui-même
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getWorkflowPath(filename) {
  // Les fichiers AI sont dans le dossier workflows/
  const workflowPath = join(__dirname, 'workflows', filename);
  
  if (!fs.existsSync(workflowPath)) {
    throw new Error(`Workflow file ${filename} not found at ${workflowPath}`);
  }
  
  return workflowPath;
}

export function readWorkflow(filename) {
  const workflowPath = getWorkflowPath(filename);
  return fs.readFileSync(workflowPath, 'utf8');
}

export function listAvailableWorkflows() {
  try {
    const workflowsDir = join(__dirname, 'workflows');
    const workflowFiles = fs.readdirSync(workflowsDir)
      .filter(file => file.startsWith('AI_') && file.endsWith('.md'));
    return workflowFiles;
  } catch (error) {
    return [];
  }
}
