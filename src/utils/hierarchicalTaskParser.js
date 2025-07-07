export class HierarchicalTaskParser {
  constructor() {
    this.currentLevel = 0;
    this.taskStack = [];
    this.contextualMessages = {
      overview: "Here are all the tasks to do",
      working_on: "Working on",
      progress_update: "Progress update",
      next_section: "Moving on to",
      completed_section: "Section completed"
    };
  }

  parseHierarchicalContent(content) {
    const structure = {
      sections: [],
      todos: [],
      hierarchy: []
    };

    if (!content || !Array.isArray(content)) {
      return structure;
    }

    let currentSection = null;
    let currentTodos = [];
    let recentHeadingDistance = 0;

    for (const block of content) {
      if (this.isHeading(block)) {
        // Save previous section
        if (currentSection) {
          structure.sections.push({
            ...currentSection,
            todos: [...currentTodos]
          });
          currentTodos = [];
        }
        
        currentSection = {
          type: 'section',
          title: this.extractText(block),
          level: this.getHeadingLevel(block),
          todos: []
        };
        recentHeadingDistance = 0;
      } else if (this.isTodo(block)) {
        recentHeadingDistance++;
        const todo = this.parseTodoWithChildren(block, 0);
        
        // Create virtual sections only for todos with children that are:
        // 1. Not under a recent heading (distance > 2)
        // 2. OR the first todo after Section 1 (special case for Section 2)
        const shouldCreateVirtualSection = todo.children && todo.children.length > 0 && 
          (recentHeadingDistance > 2 || 
           (currentSection && currentSection.title === "Section 1" && currentTodos.length >= 2));
        
        if (shouldCreateVirtualSection) {
          // Save current section if exists
          if (currentSection) {
            structure.sections.push({
              ...currentSection,
              todos: [...currentTodos]
            });
            currentTodos = [];
          }
          
          // Create virtual section from this todo
          currentSection = {
            type: 'section',
            title: todo.text,
            level: 2, // Virtual section level
            todos: []
          };
          
          // Add children as todos in this section
          for (const child of todo.children) {
            currentTodos.push(child);
            this.flattenTodos(child, structure.todos);
          }
          recentHeadingDistance = 0;
        } else {
          // Regular todo - add to current section
          currentTodos.push(todo);
          this.flattenTodos(todo, structure.todos);
        }
      }
    }

    // Handle remaining section or create default section
    if (currentSection) {
      structure.sections.push({
        ...currentSection,
        todos: [...currentTodos]
      });
    } else if (currentTodos.length > 0) {
      structure.sections.push({
        type: 'section',
        title: 'Main Tasks',
        level: 1,
        todos: [...currentTodos]
      });
    }

    structure.hierarchy = this.buildHierarchy(structure);
    return structure;
  }

  parseTodoWithChildren(block, indentLevel) {
    const todo = {
      text: this.extractText(block).trim(),
      checked: this.isChecked(block),
      indent: indentLevel,
      isSubtask: indentLevel > 0,
      children: []
    };

    // Parse children if they exist
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (this.isTodo(child)) {
          const childTodo = this.parseTodoWithChildren(child, indentLevel + 1);
          todo.children.push(childTodo);
        }
      }
    }

    return todo;
  }

  flattenTodos(todo, flatList) {
    flatList.push({
      text: todo.text,
      checked: todo.checked,
      indent: todo.indent,
      isSubtask: todo.isSubtask
    });
    
    if (todo.children) {
      for (const child of todo.children) {
        this.flattenTodos(child, flatList);
      }
    }
  }

  buildHierarchy(structure) {
    const hierarchy = [];
    
    for (const section of structure.sections) {
      const hierarchyNode = {
        type: 'section',
        title: section.title,
        level: section.level,
        children: []
      };

      for (const todo of section.todos) {
        const todoNode = this.buildTodoNode(todo);
        hierarchyNode.children.push(todoNode);
      }
      
      hierarchy.push(hierarchyNode);
    }

    return hierarchy;
  }

  buildTodoNode(todo) {
    const todoNode = {
      type: 'todo',
      text: todo.text,
      checked: todo.checked,
      children: []
    };

    if (todo.children && Array.isArray(todo.children)) {
      for (const child of todo.children) {
        const childNode = this.buildTodoNode(child);
        childNode.type = 'subtodo';
        todoNode.children.push(childNode);
      }
    }

    return todoNode;
  }

  generateProgressiveTodos(structure) {
    const messages = this.contextualMessages;
    const progressiveSteps = [];

    const topLevelTodos = structure.hierarchy.map(section => ({
      text: section.title,
      checked: false,
      type: 'section'
    }));

    if (topLevelTodos.length > 0) {
      progressiveSteps.push({
        message: messages.overview,
        todos: topLevelTodos,
        type: 'overview'
      });
    }

    for (let i = 0; i < structure.hierarchy.length; i++) {
      const section = structure.hierarchy[i];
      
      if (section.children.length > 0) {
        const sectionTodos = section.children.map(child => ({
          text: child.text,
          checked: child.checked,
          type: 'todo'
        }));

        // Step: Work on section
        progressiveSteps.push({
          message: `${messages.working_on} "${section.title}"`,
          todos: sectionTodos,
          type: 'section',
          sectionName: section.title
        });

        // Handle nested todos with children
        for (const todo of section.children) {
          if (todo.children && todo.children.length > 0) {
            const subtodos = todo.children.map(subtodo => ({
              text: subtodo.text,
              checked: subtodo.checked,
              type: 'subtodo'
            }));

            progressiveSteps.push({
              message: `${messages.working_on} "${todo.text}"`,
              todos: subtodos,
              type: 'subtask',
              parentSection: section.title,
              taskName: todo.text
            });
          }
        }

        // Step: Return to overview with section completed
        const updatedOverview = topLevelTodos.map(todo => ({
          ...todo,
          checked: structure.hierarchy.slice(0, i + 1).some(s => s.title === todo.text)
        }));

        progressiveSteps.push({
          message: `${messages.completed_section} "${section.title}"`,
          todos: updatedOverview,
          type: 'overview_return',
          completedSection: section.title
        });
      }
    }

    return progressiveSteps;
  }

  generateContextualMessage(currentStep, completedTasks) {
    const messages = this.contextualMessages;
    const completedCount = completedTasks.filter(t => t.checked).length;
    const totalCount = completedTasks.length;
    
    if (completedCount === 0) {
      return `${messages.working_on} "${currentStep}"`;
    } else if (completedCount === totalCount) {
      return `${messages.completed_section} "${currentStep}"`;
    } else {
      return `${messages.progress_update} (${completedCount}/${totalCount})`;
    }
  }

  isHeading(block) {
    return block.type && block.type.startsWith('heading_');
  }

  isTodo(block) {
    return block.type === 'to_do';
  }

  isChecked(block) {
    return block.to_do?.checked || false;
  }

  getHeadingLevel(block) {
    if (block.type === 'heading_1') return 1;
    if (block.type === 'heading_2') return 2;
    if (block.type === 'heading_3') return 3;
    return 1;
  }

  extractText(block) {
    if (block.type === 'to_do') {
      return block.to_do?.rich_text?.[0]?.plain_text || '';
    }
    if (block.type.startsWith('heading_')) {
      const headingType = block.type;
      return block[headingType]?.rich_text?.[0]?.plain_text || '';
    }
    return '';
  }

  getIndentLevel(text) {
    const match = text.match(/^(\s*)/);
    return match ? Math.floor(match[1].length / 2) : 0;
  }
}