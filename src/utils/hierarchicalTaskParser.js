export class HierarchicalTaskParser {
  constructor() {
    this.currentLevel = 0;
    this.taskStack = [];
    this.contextualMessages = {
      fr: {
        overview: "Voici toutes les tâches à faire",
        working_on: "Travaillons sur",
        progress_update: "Mise à jour de l'avancement",
        next_section: "Passons maintenant à",
        completed_section: "Section terminée"
      },
      en: {
        overview: "Here are all the tasks to do",
        working_on: "Working on",
        progress_update: "Progress update",
        next_section: "Moving on to",
        completed_section: "Section completed"
      }
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
    let indentLevel = 0;

    for (const block of content) {
      if (this.isHeading(block)) {
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
      } else if (this.isTodo(block)) {
        const todoText = this.extractText(block);
        const checked = this.isChecked(block);
        const indent = this.getIndentLevel(todoText);
        
        const todo = {
          text: todoText.trim(),
          checked,
          indent,
          isSubtask: indent > 0
        };

        currentTodos.push(todo);
        structure.todos.push(todo);
      }
    }

    if (currentSection) {
      structure.sections.push({
        ...currentSection,
        todos: [...currentTodos]
      });
    } else if (currentTodos.length > 0) {
      structure.sections.push({
        type: 'section',
        title: 'Tâches principales',
        level: 1,
        todos: [...currentTodos]
      });
    }

    structure.hierarchy = this.buildHierarchy(structure);
    return structure;
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

      let currentParent = null;
      
      for (const todo of section.todos) {
        if (todo.indent === 0) {
          const todoNode = {
            type: 'todo',
            text: todo.text,
            checked: todo.checked,
            children: []
          };
          hierarchyNode.children.push(todoNode);
          currentParent = todoNode;
        } else if (currentParent) {
          currentParent.children.push({
            type: 'subtodo',
            text: todo.text,
            checked: todo.checked,
            indent: todo.indent
          });
        }
      }
      
      hierarchy.push(hierarchyNode);
    }

    return hierarchy;
  }

  generateProgressiveTodos(structure, language = 'fr') {
    const messages = this.contextualMessages[language];
    const progressiveSteps = [];

    const topLevelTodos = structure.hierarchy.map(section => ({
      text: section.title,
      checked: false,
      type: 'section'
    }));

    if (topLevelTodos.length > 0) {
      progressiveSteps.push({
        message: messages.overview,
        todos: topLevelTodos
      });
    }

    for (const section of structure.hierarchy) {
      if (section.children.length > 0) {
        const sectionTodos = section.children.map(child => ({
          text: child.text,
          checked: child.checked,
          type: 'todo'
        }));

        progressiveSteps.push({
          message: `${messages.working_on} "${section.title}"`,
          todos: sectionTodos
        });

        for (const todo of section.children) {
          if (todo.children && todo.children.length > 0) {
            const subtodos = todo.children.map(subtodo => ({
              text: subtodo.text,
              checked: subtodo.checked,
              type: 'subtodo'
            }));

            progressiveSteps.push({
              message: `${messages.working_on} "${todo.text}"`,
              todos: subtodos
            });
          }
        }
      }
    }

    return progressiveSteps;
  }

  generateContextualMessage(currentStep, completedTasks, language = 'fr') {
    const messages = this.contextualMessages[language];
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