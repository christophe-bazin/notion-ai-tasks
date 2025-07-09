# Architecture - notion-ai-tasks

## Technology Stack

### **Core Technologies:**
- **Node.js** (>=16.0.0) - Runtime environment
- **ES Modules** - Modern JavaScript modules (`"type": "module"`)
- **@notionhq/client** - Official Notion API client
- **commander.js** - CLI framework

### **Development Tools:**
- **nodemon** - Development auto-reload
- **npm** - Package management

### **Architecture:**
- **index.js** - Core `NotionTaskManager` class
- **cli.js** - Command-line interface with commander
- **notion-tasks.config.json** - Project-specific configuration

## File Structure

```
notion-ai-tasks/
├── index.js                    # Main export file
├── cli.js                      # CLI entry point
├── workflow-loader.js          # Workflow file loader utility
├── package.json                # Package configuration
├── README.md                   # Main documentation
├── CLAUDE.md                   # Development guidelines
├── notion-tasks.config.json    # Project configuration template
├── docs/                       # Modular documentation
│   ├── development/            # Development guidelines
│   │   ├── coding-standards.md      
│   │   ├── commit-conventions.md    
│   │   ├── release-process.md       
│   │   └── documentation-style.md   
│   ├── project/                # notion-ai-tasks specific
│   │   ├── architecture.md          # This file
│   │   ├── notion-integration.md    
│   │   ├── command-strategy.md      
│   │   └── development-workflow.md  # Development workflow             
│   └── examples/               # Concrete examples
│       ├── config-examples.md       
│       └── workflow-examples.md
├── src/                        # Modular source code
│   ├── core/                   # Core business logic
│   │   ├── NotionClient.js     # Notion API client & config
│   │   ├── TaskManager.js      # Main task management logic
│   │   └── ContentManager.js   # Content & blocks management
│   ├── utils/                  # Utility functions
│   │   ├── urlParser.js        # URL/ID extraction
│   │   ├── displayHelpers.js   # CLI display functions
│   │   ├── markdownParser.js   # Markdown parsing utilities
│   │   ├── nlpParser.js        # Natural language parsing
│   │   └── hierarchicalTaskParser.js # Hierarchical task decomposition
│   └── cli/                    # CLI commands
│       ├── index.js            # CLI setup & routing
│       └── commands/           # Individual commands
│           ├── list.js
│           ├── show.js
│           ├── create.js
│           ├── update.js
│           ├── todo.js
│           ├── natural.js
│           ├── hierarchical.js
│           └── addContent.js
└── workflows/                  # AI workflow guides
    ├── AI_WORKFLOW_SELECTOR.md # AI workflow selector
    ├── AI_TASK_EXECUTION.md    # AI execution workflow
    ├── AI_TASK_CREATION.md     # AI task creation guide
    └── AI_TASK_UPDATE.md       # AI task update guide
```

## Configuration Files

### **Configuration Management:**
- **notion-tasks.config.json** - In project root, not in package
- **Keep examples updated** - Sync with actual configuration structure
- **Document all options** - Every config property should be documented

### **Package.json Bin Alias:**
The `notion-tasks` command is defined in package.json:
```json
{
  "bin": {
    "notion-tasks": "./cli.js"
  }
}
```

This creates a global command alias that points to the same `cli.js` file used locally.

## Development Context

**⚠️ Important: This project development uses local CLI execution**

All commands in this development context use `node cli.js` since we're working on the source code locally.

**Local development commands:**
```bash
# All CLI commands for this project development
node cli.js list
node cli.js show <task-id>
node cli.js update <task-id> --status "In Progress"
node cli.js todo <task-id> "Task description" true
node cli.js add-content <task-id> --content "Content"
node cli.js hierarchical <task-id> --structure
```