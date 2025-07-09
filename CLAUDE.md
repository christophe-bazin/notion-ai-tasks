# Claude Instructions - notion-ai-tasks

Node.js CLI for Notion task management with integrated AI workflows.

## Development Guidelines
- [Coding Standards](./docs/development/coding-standards.md)
- [Commit Conventions](./docs/development/commit-conventions.md)  
- [Release Process](./docs/development/release-process.md)
- [Documentation Style](./docs/development/documentation-style.md)

## Project Specifics
- [Architecture](./docs/project/architecture.md)
- [Notion Integration](./docs/project/notion-integration.md)
- [Command Strategy](./docs/project/command-strategy.md)
- [Development Workflow](./docs/project/development-workflow.md)

## Examples
- [Configuration Examples](./docs/examples/config-examples.md)
- [Workflow Examples](./docs/examples/workflow-examples.md)

## AI Workflows
- [AI Workflow Files](./workflows/) - Operational AI workflows for task management

## Essential Commands
**Always use local development syntax:**
```bash
node cli.js list
node cli.js update <task-id> --status "In Progress"
```

**Always create feature branches for tasks.**