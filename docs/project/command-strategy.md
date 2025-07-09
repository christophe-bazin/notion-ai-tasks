# Command Strategy - notion-ai-tasks

## Context-Aware Command Usage

The project supports three different command formats depending on the context:

### **1. End Users (Global Installation)**
```bash
# After: npm install -g notion-ai-tasks
notion-tasks list
notion-tasks show <task-id>
notion-tasks update <task-id> --status "In Progress"
```
**When to use:** Production usage, end users, README.md documentation

### **2. Local Development**
```bash
# For contributors and local development
node cli.js list
node cli.js show <task-id>
node cli.js update <task-id> --status "In Progress"
```
**When to use:** CLAUDE.md documentation, local development, contributor workflows

### **3. AI Workflows (npx)**
```bash
# For AI assistants and workflow automation
npx notion-ai-tasks show <task-id>
npx notion-ai-tasks update <task-id> --status "In Progress"
npx notion-ai-tasks hierarchical <task-id> --progressive
```
**When to use:** AI workflow files, automated scripts, one-time executions

## Documentation Strategy

### **Context Mapping:**
- **README.md** → Use `notion-tasks` (end user context)
- **CLAUDE.md** → Use `node cli.js` (local development context)
- **workflows/*.md** → Use `npx notion-ai-tasks` (AI workflow context)

### **Best Practices:**
1. **Context Consistency**: Always use the appropriate command format for your context
2. **Documentation Alignment**: Match command examples to target audience
3. **Error Prevention**: Clear context reduces confusion between formats
4. **Team Communication**: Ensure all contributors understand the three contexts

## Implementation Details

### **Package.json Bin Alias:**
```json
{
  "bin": {
    "notion-tasks": "./cli.js"
  }
}
```

This creates a global command alias that points to the same `cli.js` file used locally.

### **Command Structure:**
```
cli.js (entry point)
├── list command
├── show command
├── create command
├── update command
├── todo command
├── natural command
├── hierarchical command
└── add-content command
```

## Usage Examples

### **Development Context:**
```bash
# When working on the source code
node cli.js list
node cli.js show abc123
node cli.js update abc123 --status "In Progress"
node cli.js todo abc123 "Complete implementation" true
```

### **End User Context:**
```bash
# After global installation
notion-tasks list
notion-tasks show abc123
notion-tasks update abc123 --status "In Progress"
```

### **AI Workflow Context:**
```bash
# In automation scripts
npx notion-ai-tasks show abc123
npx notion-ai-tasks update abc123 --status "In Progress"
npx notion-ai-tasks hierarchical abc123 --progressive
```

## Command Categories

### **Core Commands:**
- `list` - List all tasks
- `show <task-id>` - Show detailed task information
- `update <task-id>` - Update task properties
- `create` - Create new tasks

### **Advanced Commands:**
- `todo <task-id>` - Manage task todos
- `natural` - Natural language task processing
- `hierarchical <task-id>` - Hierarchical task breakdown
- `add-content <task-id>` - Add content to tasks

### **Workflow Commands:**
- Commands specifically designed for AI workflows
- Support for progressive task breakdown
- Automated status updates based on workflows