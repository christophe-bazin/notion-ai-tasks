# Command Strategy - notion-ai-tasks

## Context-Aware Command Philosophy

The project supports three different command formats depending on the context:

### **1. End Users (Global Installation)**
**Format:** `notion-tasks <command>`
**Purpose:** Production usage, end users, README.md documentation

### **2. Local Development**
**Format:** `node cli.js <command>`
**Purpose:** CLAUDE.md documentation, local development, contributor workflows

### **3. AI Workflows (npx)**
**Format:** `npx notion-ai-tasks <command>`
**Purpose:** AI workflow files, automated scripts, one-time executions

## Documentation Strategy

### **Context Mapping:**
- **README.md** → Use `notion-tasks` (end user context)
- **CLAUDE.md** → Use `node cli.js` (local development context)
- **workflows/*.md** → Use `npx notion-ai-tasks` (AI workflow context)

### **Best Practices:**
- **Context Consistency**: Always use the appropriate command format for your context
- **Documentation Alignment**: Match command examples to target audience
- **Error Prevention**: Clear context reduces confusion between formats

## Implementation Concept

### **Single Binary, Multiple Contexts:**
The `notion-tasks` command is defined in package.json bin alias, pointing to the same `cli.js` file used locally. This creates consistency across all contexts while maintaining clear separation of usage patterns.

### **Command Categories:**
- **Core Commands:** Basic CRUD operations
- **Advanced Commands:** Enhanced functionality (todos, natural language)
- **Workflow Commands:** AI-specific operations

## Guiding Principles

- **Context-appropriate syntax** in all documentation
- **Consistent command structure** across all contexts
- **Clear separation** between development and production usage
- **AI workflow integration** without breaking standard CLI patterns