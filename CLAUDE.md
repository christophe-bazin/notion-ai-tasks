# CLAUDE.md - Development Guidelines

This file contains development guidelines for Claude Code when working on the `notion-ai-tasks` project.

## 📝 **Mandatory Updates**

### **Always Update After Changes:**

1. **README.md** - Keep documentation current with new features
2. **package.json** - Bump version following semver
3. **Configuration examples** in all .md files
4. **CLAUDE.md** - Update this file if any project structure, guidelines, or practices change

### **Release Flow (GitHub Actions Automated Publishing):**
```bash
# 1. Create release branch
git checkout -b release/vX.X.X

# 2. Update package.json and package-lock.json versions
npm version patch|minor|major --no-git-tag-version

# 3. Update README.md with new features/options
# 4. Update CLAUDE.md if project structure, practices, or guidelines changed
# 5. Test configuration examples
# 6. Commit and push release branch
git add .
git commit -m "bump version to X.X.X"
git push origin release/vX.X.X

# 7. Create PR from release branch to main
# 8. After PR merge, GitHub Actions will automatically publish to npm
```

### **Important Notes:**
- **Always use release branches** for version updates
- **Both package.json AND package-lock.json** must be updated with same version
- **Use `--no-git-tag-version`** to prevent npm from creating tags locally
- **GitHub Actions handles npm publishing** after PR merge to main

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
- **No comments** unless explicitly requested by user
- **ES6+ syntax** - Use modern JavaScript features
- **Async/await** - Prefer over Promises
- **Error handling** - Always wrap in try/catch
- **Destructuring** - Use object/array destructuring where appropriate

### **Configuration Management:**
- **Never hardcode values** - Always use configuration variables
- **Explicit configuration** - Use named properties instead of arrays for statuses
- **Error on missing config** - Throw clear errors if required config is missing

### **API Design:**
- **Consistent method naming** - Use clear, descriptive names
- **Return consistent objects** - Always return `{ success: boolean, ... }`
- **Chain-friendly** - Methods should be composable

## 📚 **Documentation Standards**

### **Comments in Code:**
```javascript
// Load configuration from notion-tasks.config.json in current directory
// Update checkbox properties with case-insensitive matching
// Apply all todo updates simultaneously
```
- **Factual, not explanatory** - What the code does, not why
- **Concise** - One line preferred
- **Present tense** - "Updates task" not "Will update task"

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
├── index.js                    # Core NotionTaskManager class
├── cli.js                      # CLI interface
├── workflow-loader.js          # Workflow file loader utility
├── package.json                # Package configuration
├── README.md                   # Main documentation
├── CLAUDE.md                   # This file - development guidelines
├── notion-tasks.config.json    # Project configuration template
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
npx notion-ai-tasks list

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

### **Development Rules:**
- **Never hardcode values** - Always use configuration variables
- **Explicit configuration** - Use named properties instead of arrays for statuses
- **Error on missing config** - Throw clear errors if required config is missing
- **Case-insensitive matching** - Match property names ignoring case
- **Type validation** - Ensure properties match expected types

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