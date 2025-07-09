# Documentation Style - notion-ai-tasks

## Markdown Documentation Standards

### **Configuration Variables section:**
- Always start with `## 📝 Configuration Variables`
- **Consistent structure** across all .md files
- **Examples with real values** - Keep examples concrete and usable
- **Bracket notation** - Use `[configVariable]` for syntax, real values for examples

### **Standard .md Structure:**
```markdown
# Document Title

## 📝 Configuration Variables
[Description of configuration variables]

## 🔧 Installation/Setup
[Installation or configuration instructions]

## 📋 Usage
[Concrete usage examples]

## 🎯 Examples
[Practical examples with real values]

## 🚨 Troubleshooting
[Common problem solutions]
```

## File Structure Guidelines

**⚠️ IMPORTANT: When adding, removing, or renaming files, update this section and the Project Structure section in README.md**

### **Regular Updates:**
- README.md version number matches package.json
- All .md files use consistent configuration variable notation
- Examples in documentation work with current code
- Error messages are clear and actionable
- Configuration template includes all required properties
- CLAUDE.md reflects current project structure, practices, and guidelines

## Testing & Validation

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

## Best Practices

### **Documentation Strategy:**
- **README.md** → Use `notion-tasks` (end user context)
- **CLAUDE.md** → Use `node cli.js` (local development context)
- **workflows/*.md** → Use `npx notion-ai-tasks` (AI workflow context)

### **Content Guidelines:**
- **Clear headings** with emoji icons for visual organization
- **Code blocks** with proper syntax highlighting
- **Real examples** rather than placeholder text
- **Step-by-step instructions** for complex processes
- **Consistent formatting** across all documentation files

### **Maintenance:**
- **Keep examples current** with actual code behavior
- **Update cross-references** when files are moved or renamed
- **Verify all links work** before committing
- **Test configuration examples** to ensure they work