# CLAUDE.md - Development Guidelines

This file contains development guidelines for Claude Code when working on the `notion-ai-tasks` project.

## 📝 **Mandatory Updates**

### **Always Update After Changes:**

1. **README.md** - Keep documentation current
2. **Version in README.md** - Update `**Add Configuration** (version X.X.X):` section
3. **package.json** - Bump version following semver
4. **Configuration examples** in all .md files
5. **CLAUDE.md** - Update this file if any project structure, guidelines, or practices change

### **Version Update Checklist:**
```bash
# 1. Update package.json version
npm version patch|minor|major

# 2. Update README.md configuration section
# Find: **Add Configuration** (version 1.1.7):
# Replace with new version number

# 3. Update CLAUDE.md if project structure, practices, or guidelines changed
# 4. Test configuration examples
# 5. Commit changes with version tag
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
├── package.json                # Package configuration
├── README.md                   # Main documentation
├── CLAUDE.md                   # This file - development guidelines
├── notion-tasks.config.json    # Project configuration template
├── AI_TASK_EXECUTION.md        # AI execution workflow
├── AI_TASK_CREATION.md         # AI task creation guide
├── AI_TASK_UPDATE.md           # AI task update guide
└── AI_WORKFLOW_SELECTOR.md     # AI workflow selector
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

## 📐 **Status Management System**

### **Status Flow:**
```
Not Started → In Progress → Test → Done
     ↑            ↑          ↑      ↑
defaultStatus  inProgressStatus  testStatus  completionStatus
```

### **Automatic Transitions:**
- **0% progress** → `defaultStatus`
- **1-99% progress** → `inProgressStatus`  
- **100% progress** → `testStatus` (automatic)
- **After validation** → `completionStatus` (manual only)

### **Important Rules:**
- **Never auto-complete to "Done"** - Only `testStatus` is automatic
- **Always use config variables** - No hardcoded status strings
- **Throw errors for missing config** - Don't fall back silently

## 🎨 **Notion Integration Guidelines**

### **Content Structure:**
- **Rich text format** - Use Notion's rich text structure
- **Block types** - Support heading_2, paragraph, to_do, bulleted_list_item
- **Todo management** - Support checking/unchecking todos in content

### **Error Handling:**
```javascript
try {
  // Notion API call
} catch (error) {
  console.error('Error [specific operation]:', error);
  throw error;
}
```

### **Property Mapping:**
- **Case-insensitive** - Match property names ignoring case
- **Type validation** - Ensure properties match expected types
- **Graceful defaults** - Use config defaults when values missing

## 🔄 **Workflow Integration**

### **AI Workflow Files:**
- **Keep syntax consistent** - Same `[variable]` notation across all files
- **Real examples** - Concrete task IDs and values in examples
- **Step numbering** - Clear sequential steps
- **Marker notation** - Use `[+]` for AI-added content

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
- [ ] README.md version number matches package.json
- [ ] All .md files use consistent configuration variable notation
- [ ] Examples in documentation work with current code
- [ ] Error messages are clear and actionable
- [ ] Configuration template includes all required properties
- [ ] CLAUDE.md reflects current project structure, practices, and guidelines

### **Before Release:**
- [ ] Version bumped in package.json
- [ ] README.md configuration section updated
- [ ] README.md Project Structure section matches actual files
- [ ] CLAUDE.md File Structure section matches actual files
- [ ] All workflow .md files tested
- [ ] No hardcoded values in code
- [ ] All configuration options documented