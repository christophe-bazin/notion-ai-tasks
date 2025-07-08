# CLAUDE.md - Development Guidelines

This file contains development guidelines for Claude Code when working on the `notion-ai-tasks` project.

## 📝 **Mandatory Updates**

### **Always Update After Changes:**

1. **README.md** - Keep documentation current with new features
2. **package.json** - Bump version following semver
3. **Configuration examples** in all .md files
4. **CLAUDE.md** - Update this file if any project structure, guidelines, or practices change

### **Task Execution Workflow (Feature Branches):**
```bash
# When taking a task from Notion for execution:

# 1. Create feature branch from current branch
git checkout -b feature/task-name-or-id

# 2. Update task status in Notion to "In Progress"
node cli.js update <task-id> --status "In Progress"

# 3. Work on the task following the implementation plan
# 4. Make commits with clear messages during development
# 5. Update todos in Notion as you progress
# 6. When task is complete, push branch
git push origin feature/task-name-or-id

# 7. Create PR from feature branch to main/develop
# 8. After PR merge, task will auto-update to "Test" status
```

### **Release Flow (GitHub Actions Automated Publishing):**
```bash
# 1. Create release branch
git checkout -b release/vX.X.X

# 2. Update package.json and package-lock.json versions
npm version patch|minor|major --no-git-tag-version

# 3. Update README.md with new features/options
# 4. Update CLAUDE.md if project structure, practices, or guidelines changed
# 5. Test configuration examples
# 6. Create release notes with changes since last release
# 7. Commit and push release branch
git add .
git commit -m "bump version to X.X.X

- Feature 1: Description
- Feature 2: Description
- Bug Fix: Description
- Enhancement: Description"
git push origin release/vX.X.X

# 8. Create PR from release branch to main with release notes
# 9. After PR merge, GitHub Actions will automatically publish to npm
```

### **Semantic Versioning Guidelines:**

**PATCH (X.X.1)** - Bug fixes and small improvements:
```bash
npm version patch --no-git-tag-version
```
- Bug fixes that don't change API
- Documentation updates
- Internal refactoring without behavior change
- Performance improvements
- Security patches

**MINOR (X.1.0)** - New features that are backward compatible:
```bash
npm version minor --no-git-tag-version
```
- New CLI commands or options
- New API methods or properties
- New configuration options (with defaults)
- Enhanced functionality that doesn't break existing usage
- New workflow files or templates

**MAJOR (1.0.0)** - Breaking changes:
```bash
npm version major --no-git-tag-version
```
- Changes to existing API method signatures
- Removal of CLI commands or options
- Changes to configuration file structure requiring user updates
- Changes to default behavior that could break existing workflows
- Node.js version requirement changes

### **Important Notes:**

**For Task Execution:**
- **Always create feature branches** for Notion tasks
- **Update Notion status** to "In Progress" when starting work
- **Follow branch naming**: `feature/task-name-or-id` or `feature/short-description`
- **Keep commits atomic** and descriptive
- **Update todos progressively** in Notion during development

**For Releases:**
- **Always use release branches** for version updates
- **Both package.json AND package-lock.json** must be updated with same version
- **Use `--no-git-tag-version`** to prevent npm from creating tags locally
- **Include detailed release notes** in commit message
- **GitHub Actions handles npm publishing** after PR merge to main

**For Commits:**
- **NEVER add Claude as Co-Authored-By** in commit messages
- **Keep commit messages clean** and professional
- **Focus on the actual changes** made, not the AI assistance used
- **Subject line max 50 characters** - GitHub standard for commit titles
- **Body text max 72 characters** - Wrap commit body at 72 characters
- **Use --amend for small fixes** - For typos, small fixes, or direct improvements to the last commit:
  ```bash
  # For small fixes or improvements to the last commit
  git add .
  git commit --amend
  # Edit commit message to reflect the complete change
  ```

## 🛠️ **Technology Stack**

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

## 📋 **Development Best Practices**

### **Code Style:**
- **Minimal comments** - Prefer self-documenting code over excessive comments
- **ES6+ syntax** - Use modern JavaScript features
- **Async/await** - Prefer over Promises
- **Error handling** - Always wrap in try/catch
- **Destructuring** - Use object/array destructuring where appropriate

### **Comment Guidelines:**
**When to add comments:**
- **Complex business logic** that isn't immediately obvious
- **Non-obvious technical decisions** or workarounds
- **API integrations** with external services (Notion, etc.)
- **Security-critical sections** requiring special attention
- **Performance optimizations** that sacrifice readability

**When NOT to add comments:**
- **Obvious operations** - `const user = getUser()` doesn't need "Get user"
- **Self-explanatory variable names** - `isValid`, `hasPermission`
- **Standard patterns** - basic loops, simple conditionals
- **Redundant descriptions** - Don't repeat what the code already says

**Comment style:**
```javascript
// Bad: obvious and redundant
const users = []; // Create empty array
users.push(newUser); // Add user to array

// Good: explains the why, not the what
const users = [];
// Batch process users to avoid rate limiting Notion API
for (const user of userBatch) {
  await processWithDelay(user);
}

// Good: explains non-obvious business logic
// Match status case-insensitively because Notion vs config may differ
const statusMatch = currentStatus.toLowerCase() === targetStatus.toLowerCase();

// Good: explains technical decisions
// Use Set for O(1) lookup performance with large task lists
const completedTaskIds = new Set(completed.map(t => t.id));
```

**Comment principles:**
- **Explain WHY, not WHAT** - Focus on reasoning, not obvious operations
- **Concise but complete** - One line preferred, but add context when needed
- **Present tense** - "Updates task" not "Will update task"
- **Business context** - Explain domain-specific decisions
- **Technical context** - Clarify non-obvious implementation choices

### **Configuration Management:**
- **Never hardcode values** - Always use configuration variables
- **Explicit configuration** - Use named properties instead of arrays for statuses
- **Error on missing config** - Throw clear errors if required config is missing

### **API Design:**
- **Consistent method naming** - Use clear, descriptive names
- **Return consistent objects** - Always return `{ success: boolean, ... }`
- **Chain-friendly** - Methods should be composable

## 📚 **Documentation Standards**

### **Error Messages:**
```javascript
throw new Error('testStatus is required in configuration');
throw new Error(`Todo containing "${todoText}" not found`);
```
- **Specific and actionable** - Tell user exactly what's wrong
- **Include context** - What was being attempted
- **No generic messages** - Avoid "Something went wrong"

### **Markdown Documentation:**
- **Configuration Variables section** - Always start with `## 📝 Configuration Variables`
- **Consistent structure** across all .md files
- **Examples with real values** - Keep examples concrete and usable
- **Bracket notation** - Use `[configVariable]` for syntax, real values for examples

## 🔧 **File Structure Guidelines**

**⚠️ IMPORTANT: When adding, removing, or renaming files, update this section and the Project Structure section in README.md**

### **Core Files:**
```
notion-ai-tasks/
├── index.js                    # Main export file
├── cli.js                      # CLI entry point
├── workflow-loader.js          # Workflow file loader utility
├── package.json                # Package configuration
├── README.md                   # Main documentation
├── CLAUDE.md                   # This file - development guidelines
├── notion-tasks.config.json    # Project configuration template
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

### **Configuration Files:**
- **notion-tasks.config.json** - In project root, not in package
- **Keep examples updated** - Sync with actual configuration structure
- **Document all options** - Every config property should be documented

## 🎯 **Testing & Validation**

### **Before Committing:**
1. **Test CLI commands** - Verify all commands work
2. **Validate configuration** - Test with minimal config
3. **Check documentation** - Ensure examples match code
4. **Run linting** - If available in project

### **Configuration Testing:**
```bash
# Test basic functionality
node cli.js list

# Test configuration loading
node -e "console.log(JSON.parse(require('fs').readFileSync('./notion-tasks.config.json')))"
```

## 🎨 **Notion Integration Guidelines**

### **Error Handling:**
```javascript
try {
  // Notion API call
} catch (error) {
  console.error('Error [specific operation]:', error);
  throw error;
}
```

### **Notion-Specific Rules:**
- **Case-insensitive matching** - Match property names ignoring case (Notion vs config differences)
- **Type validation** - Ensure properties match expected Notion types
- **Graceful degradation** - Handle missing optional config (like testStatus) with warnings
- **Status validation** - Validate that configured statuses exist in Notion database
- **Rate limiting** - Respect Notion API rate limits with proper delays

## 🔄 **Workflow Integration**

### **AI Workflow Files:**
- **Keep syntax consistent** - Same `[variable]` notation across all files
- **Real examples** - Concrete task IDs and values in examples
- **Step numbering** - Clear sequential steps
- **Organized structure** - All AI files in `workflows/` directory

### **CLI Natural Language:**
- **Support multiple languages** - French and English patterns
- **Flexible parsing** - Match various phrasings
- **Clear error messages** - Show examples when parsing fails

## 🚨 **Security Considerations**

### **Credential Handling:**
- **Local config files only** - Never commit real tokens
- **Clear error messages** - Help users set up credentials correctly
- **No credential logging** - Never log tokens or sensitive data

### **Input Validation:**
- **Sanitize inputs** - Validate all user inputs
- **Type checking** - Ensure parameters are expected types
- **Length limits** - Reasonable limits on text content

## 📋 **Maintenance Checklist**

### **Regular Updates:**
- README.md version number matches package.json
- All .md files use consistent configuration variable notation
- Examples in documentation work with current code
- Error messages are clear and actionable
- Configuration template includes all required properties
- CLAUDE.md reflects current project structure, practices, and guidelines

### **Before Release:**
- Version bumped in package.json
- README.md configuration section updated
- README.md Project Structure section matches actual files
- CLAUDE.md File Structure section matches actual files
- All workflow .md files tested
- No hardcoded values in code
- All configuration options documented