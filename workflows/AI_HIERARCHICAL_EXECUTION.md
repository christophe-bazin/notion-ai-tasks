# AI Hierarchical Task Execution Workflow

## Overview
This workflow enables AI to execute hierarchical tasks by decomposing them into progressive steps, allowing for step-by-step iteration through sections and subtasks.

## When to Use
Use this workflow when:
- Task content contains hierarchical structure with headings and nested todos
- Task has multiple sections with sub-tasks
- You need to work through complex tasks systematically
- User explicitly requests step-by-step execution

## Detection Patterns
**Hierarchical Structure Indicators:**
- `## Section Title` followed by todos
- `☐ Main Task` with indented `  ☐ Sub-task`
- Multiple sections with organized sub-tasks
- Complex task breakdown requiring systematic approach

## Workflow Steps

### 1. Analyze Task Structure
```javascript
// Get hierarchical structure
const structure = await taskManager.getHierarchicalStructure(taskId);
```

### 2. Generate Progressive Steps
```javascript
// Generate step-by-step todos
const progressiveSteps = await taskManager.generateProgressiveTodos(taskId, language);
```

### 3. Execute Step-by-Step

**Step 1: Overview**
```javascript
// First step: Show all top-level sections
"Voici toutes les tâches à faire"
Update todo
- [ ] Section de tâches
- [ ] Autre section
```

**Step 2: Section Focus**
```javascript
// Focus on specific section
"Travaillons sur 'Section de tâches'"
Update todo
- [ ] Tâche 1
- [ ] Tâche 2
```

**Step 3: Sub-task Focus** (if nested)
```javascript
// Focus on specific task with sub-tasks
"Travaillons sur 'Tâche 1'"
Update todo
- [ ] Sous-tâche 1.1
- [ ] Sous-tâche 1.2
```

**Step 4: Progress Updates**
```javascript
// Update progress as you complete
"Mise à jour de l'avancement"
Update todo
- [x] Sous-tâche 1.1
- [ ] Sous-tâche 1.2
```

**Step 5: Section Completion**
```javascript
// Mark section complete and move to next
"Section terminée - Passons à la suivante"
Update todo
- [x] Section de tâches
- [ ] Autre section
```

## Implementation Guidelines

### AI Execution Pattern
1. **Analyze Structure First**
   - Always call `getHierarchicalStructure()` before starting
   - Identify sections, main tasks, and sub-tasks
   - Plan the execution approach

2. **Follow Progressive Steps**
   - Use `generateProgressiveTodos()` to get step sequence
   - Execute one step at a time
   - Update todos progressively, not all at once

3. **Contextual Messaging**
   - Use appropriate French/English messages
   - Generate contextual messages based on current step
   - Provide clear progress indicators

### CLI Integration
```bash
# Analyze structure
npx notion-ai-tasks hierarchical [taskId] --structure

# Generate progressive steps
npx notion-ai-tasks hierarchical [taskId] --progressive

# Execute with language preference
npx notion-ai-tasks hierarchical [taskId] --progressive --language fr
```

## Example Execution Flow

### Input Task Structure:
```
## Section A
☐ Task A1
  ☐ Sub-task A1.1
  ☐ Sub-task A1.2
☐ Task A2

## Section B
☐ Task B1
☐ Task B2
```

### AI Execution Steps:

**Step 1: Initial Overview**
```
"Voici toutes les tâches à faire"
Update todo
- [ ] Section A
- [ ] Section B
```

**Step 2: Focus on Section A**
```
"Travaillons sur 'Section A'"
Update todo
- [ ] Task A1
- [ ] Task A2
```

**Step 3: Focus on Task A1 (has sub-tasks)**
```
"Travaillons sur 'Task A1'"
Update todo
- [ ] Sub-task A1.1
- [ ] Sub-task A1.2
```

**Step 4: Complete Sub-tasks**
```
"Mise à jour de l'avancement"
Update todo
- [x] Sub-task A1.1
- [x] Sub-task A1.2
```

**Step 5: Mark Task A1 Complete**
```
"Task A1 terminée"
Update todo
- [x] Task A1
- [ ] Task A2
```

**Step 6: Continue with remaining tasks...**

## Benefits
- **Systematic Execution**: No missed tasks or sub-tasks
- **Clear Progress**: Visual progress through hierarchy
- **Contextual Updates**: Appropriate messages for each step
- **Flexible Language**: French/English support
- **Scalable**: Works with any depth of hierarchy

## Configuration Variables
- `language`: 'fr' or 'en' for message language
- `taskId`: The Notion task ID to analyze
- `structure`: Boolean to show hierarchical structure
- `progressive`: Boolean to generate progressive steps

## Error Handling
- Handle missing task content gracefully
- Provide clear error messages for malformed structures
- Fall back to simple todo list if hierarchy detection fails