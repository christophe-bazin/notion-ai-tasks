export function parseNaturalLanguage(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('create') || lower.includes('créer')) {
    const match = text.match(/(?:create|créer)(?:\s+(?:task|tâche|une tâche))?\s+(.+)/i);
    if (match) {
      return { action: 'create', title: match[1].trim() };
    }
  }
  
  if (lower.includes('update') || lower.includes('modifier')) {
    const match = text.match(/(?:update|modifier)(?:\s+(?:task|tâche))?\s+(\S+)(?:\s+(?:to|à|vers))?\s+(.+)/i);
    if (match) {
      return { action: 'update', id: match[1], status: match[2].trim() };
    }
  }
  
  if (lower.includes('list') || lower.includes('lister') || lower.includes('afficher')) {
    return { action: 'list' };
  }
  
  if (lower.includes('work on') || lower.includes('travailler sur') || text.includes('http')) {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return { action: 'work', url: urlMatch[0] };
    }
  }
  
  return null;
}