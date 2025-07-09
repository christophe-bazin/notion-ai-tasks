# Coding Standards - notion-ai-tasks

## Code Style

### **General Principles:**
- **ES6+ syntax** - Use modern JavaScript features
- **Async/await** - Prefer over Promises
- **Destructuring** - Use object/array destructuring where appropriate
- **Self-documenting code** - Write clear, readable code that explains itself

### **Comment Guidelines:**

**When to add comments:**
- **File purpose summary** - Brief description of what the file does at the top
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
// Good: File purpose summary at the top
/**
 * TaskManager.js
 * Manages CRUD operations for Notion tasks with status validation
 * and hierarchical task decomposition support
 */

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
- **File purpose first** - Start each file with a brief summary comment
- **Explain WHY, not WHAT** - Focus on reasoning, not obvious operations
- **Business and technical context** - Explain domain-specific and implementation decisions

## Configuration Management

- **Never hardcode values** - Always use configuration variables
- **Explicit configuration** - Use named properties instead of arrays for statuses
- **Error on missing config** - Throw clear errors if required config is missing

## API Design

- **Consistent method naming** - Use clear, descriptive names
- **Return consistent objects** - Always return `{ success: boolean, ... }`
- **Chain-friendly** - Methods should be composable

## Error Handling

### **Error Messages:**
```javascript
throw new Error('testStatus is required in configuration');
throw new Error(`Todo containing "${todoText}" not found`);
```
- **Specific and actionable** - Tell user exactly what's wrong
- **Include context** - What was being attempted
- **No generic messages** - Avoid "Something went wrong"

### **Notion API Error Handling:**
```javascript
try {
  // Notion API call
} catch (error) {
  console.error('Error [specific operation]:', error);
  throw error;
}
```

## Security Considerations

### **Credential Handling:**
- **Local config files only** - Never commit real tokens
- **Clear error messages** - Help users set up credentials correctly
- **No credential logging** - Never log tokens or sensitive data

### **Input Validation:**
- **Sanitize inputs** - Validate all user inputs
- **Type checking** - Ensure parameters are expected types
- **Length limits** - Reasonable limits on text content