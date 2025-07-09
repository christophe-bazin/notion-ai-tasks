# Configuration Examples - notion-ai-tasks

## Minimal Configuration

```json
{
  "notionToken": "secret_abc123...",
  "databaseId": "1234567890abcdef",
  "statusProperty": "Status",
  "titleProperty": "Name",
  "statuses": {
    "todo": "To Do",
    "inProgress": "In Progress",
    "done": "Done"
  }
}
```

## Complete Configuration

```json
{
  "notionToken": "secret_abc123...",
  "databaseId": "1234567890abcdef",
  "statusProperty": "Status",
  "titleProperty": "Name",
  "contentProperty": "Content",
  "priorityProperty": "Priority",
  "assigneeProperty": "Assignee",
  "statuses": {
    "todo": "To Do",
    "inProgress": "In Progress",
    "done": "Done",
    "test": "Test"
  },
  "testStatus": "Test"
}
```

## Configuration with French Statuses

```json
{
  "notionToken": "secret_abc123...",
  "databaseId": "1234567890abcdef",
  "statusProperty": "Statut",
  "titleProperty": "Nom",
  "contentProperty": "Contenu",
  "statuses": {
    "todo": "À faire",
    "inProgress": "En cours",
    "done": "Terminé",
    "test": "Test"
  },
  "testStatus": "Test"
}
```

## Environment Variables

```bash
# Alternative à la configuration JSON
export NOTION_TOKEN="secret_abc123..."
export NOTION_DATABASE_ID="1234567890abcdef"
export NOTION_STATUS_PROPERTY="Status"
export NOTION_TITLE_PROPERTY="Name"
```

## Configuration Validation

### **Configuration Testing:**
```bash
# Vérifier que la configuration est valide
node cli.js list

# Tester avec configuration minimale
node -e "console.log(JSON.parse(require('fs').readFileSync('./notion-tasks.config.json')))"
```

### **Common Errors:**
- **Invalid token** : Check the Notion integration token
- **Incorrect Database ID** : Verify the database ID
- **Missing properties** : Check that properties exist in Notion
- **Incorrect statuses** : Verify that statuses match those in Notion

## Usage Examples

### **Basic Commands:**
```bash
# Lister les tâches
node cli.js list

# Afficher une tâche
node cli.js show abc123

# Mettre à jour le statut
node cli.js update abc123 --status "In Progress"
```

### **Advanced Commands:**
```bash
# Ajouter un todo
node cli.js todo abc123 "Implémenter la fonctionnalité" true

# Ajouter du contenu
node cli.js add-content abc123 --content "Détails supplémentaires"

# Traitement hiérarchique
node cli.js hierarchical abc123 --structure
```