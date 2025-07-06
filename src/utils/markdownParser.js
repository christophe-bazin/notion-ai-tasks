export function parseMarkdownToNotionBlocks(markdown) {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const blocks = [];
  let currentBlock = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      continue;
    }
    
    // Parse headings
    if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(4) } }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3) } }]
        }
      });
    } else if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    }
    // Parse todos
    else if (line.startsWith('- [ ] ')) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: line.substring(6) } }],
          checked: false
        }
      });
    } else if (line.startsWith('- [x] ')) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: line.substring(6) } }],
          checked: true
        }
      });
    }
    // Parse bullet points
    else if (line.startsWith('- ')) {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    }
    // Parse numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: content } }]
        }
      });
    }
    // Everything else is a paragraph
    else {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line } }]
        }
      });
    }
  }
  
  return blocks;
}