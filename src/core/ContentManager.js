export class ContentManager {
  constructor(notionClient) {
    this.notion = notionClient.getClient();
  }

  async addContentToTask(taskId, content) {
    try {
      const blocksWithoutChildren = content.map(block => {
        const { children, ...blockWithoutChildren } = block;
        return blockWithoutChildren;
      });
      
      const response = await this.notion.blocks.children.append({
        block_id: taskId,
        children: blocksWithoutChildren
      });
      
      for (let i = 0; i < content.length; i++) {
        const originalBlock = content[i];
        const createdBlock = response.results[i];
        
        if (originalBlock.children && originalBlock.children.length > 0) {
          await this.addContentToTask(createdBlock.id, originalBlock.children);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding content to task:', error);
      throw error;
    }
  }

  async getTaskContent(taskId) {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: taskId
      });
      return await this.getAllBlocksRecursively(response.results);
    } catch (error) {
      console.error('Error getting task content:', error);
      throw error;
    }
  }

  async getAllBlocksRecursively(blocks) {
    const allBlocks = [];
    
    for (const block of blocks) {
      // Add the block with its children preserved
      const blockWithChildren = { ...block };
      
      if (block.has_children) {
        try {
          const childrenResponse = await this.notion.blocks.children.list({
            block_id: block.id
          });
          const childBlocks = await this.getAllBlocksRecursively(childrenResponse.results);
          blockWithChildren.children = childBlocks;
        } catch (error) {
          console.error(`Error getting children for block ${block.id}:`, error);
          blockWithChildren.children = [];
        }
      }
      
      allBlocks.push(blockWithChildren);
    }
    
    return allBlocks;
  }

  async updateTodoInContent(taskId, todoText, checked) {
    try {
      const blocks = await this.getTaskContent(taskId);
      
      const cleanTodoText = todoText.trim();
      
      const todoBlock = blocks.find(block => 
        block.type === 'to_do' && 
        block.to_do.rich_text[0]?.plain_text.trim() === cleanTodoText
      );

      if (!todoBlock) {
        await this.notion.blocks.children.append({
          block_id: taskId,
          children: [{
            type: 'to_do',
            to_do: {
              rich_text: [{ type: 'text', text: { content: cleanTodoText } }],
              checked: checked
            }
          }]
        });
        return { success: true, created: true };
      }

      await this.notion.blocks.update({
        block_id: todoBlock.id,
        to_do: {
          rich_text: todoBlock.to_do.rich_text,
          checked: checked
        }
      });

      return { success: true, created: false };
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

}