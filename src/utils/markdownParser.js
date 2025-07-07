export function parseMarkdownToNotionBlocks(markdown) {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }
    
    // Parse code blocks
    if (line.startsWith('```')) {
      const language = line.substring(3).trim();
      const codeLines = [];
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      blocks.push({
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
          language: language || 'plain text'
        }
      });
      i++; // Skip closing ```
      continue;
    }
    
    // Parse quotes
    if (line.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        quote: {
          rich_text: parseRichText(line.substring(2))
        }
      });
    }
    // Parse dividers
    else if (line === '---' || line === '***') {
      blocks.push({
        type: 'divider',
        divider: {}
      });
    }
    // Parse headings
    else if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: parseRichText(line.substring(4))
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: parseRichText(line.substring(3))
        }
      });
    } else if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: parseRichText(line.substring(2))
        }
      });
    }
    // Parse todos
    else if (line.startsWith('- [ ] ')) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: parseRichText(line.substring(6)),
          checked: false
        }
      });
    } else if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: parseRichText(line.substring(6)),
          checked: true
        }
      });
    }
    // Parse bullet points
    else if (line.startsWith('- ')) {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: parseRichText(line.substring(2))
        }
      });
    }
    // Parse numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: parseRichText(content)
        }
      });
    }
    // Everything else is a paragraph
    else {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: parseRichText(line)
        }
      });
    }
    
    i++;
  }
  
  return blocks;
}

function parseRichText(text) {
  if (!text) return [{ type: 'text', text: { content: '' } }];
  
  const richText = [];
  let currentPos = 0;
  
  // Pattern to match: **bold**, *italic*, `code`, [link](url)
  // Order matters - bold before italic to avoid conflicts
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /`(.*?)`/g, type: 'code' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },
    { regex: /\*(.*?)\*/g, type: 'italic' }
  ];
  
  const matches = [];
  
  // Find all pattern matches
  patterns.forEach(pattern => {
    pattern.regex.lastIndex = 0; // Reset regex
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type: pattern.type,
        content: match[1],
        url: match[2] // for links
      });
    }
  });
  
  // Sort matches by position, then by end position (longer matches first)
  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });
  
  // Remove overlapping matches (keep the first/longest)
  const validMatches = [];
  for (const match of matches) {
    const overlaps = validMatches.some(existing => 
      (match.start < existing.end && match.end > existing.start)
    );
    if (!overlaps) {
      validMatches.push(match);
    }
  }
  
  // Sort final matches by position
  validMatches.sort((a, b) => a.start - b.start);
  
  // Process text with formatting
  validMatches.forEach(match => {
    // Add plain text before this match
    if (currentPos < match.start) {
      const plainText = text.substring(currentPos, match.start);
      if (plainText) {
        richText.push({ type: 'text', text: { content: plainText } });
      }
    }
    
    // Add formatted text
    if (match.type === 'bold') {
      richText.push({
        type: 'text',
        text: { content: match.content },
        annotations: { bold: true }
      });
    } else if (match.type === 'italic') {
      richText.push({
        type: 'text',
        text: { content: match.content },
        annotations: { italic: true }
      });
    } else if (match.type === 'code') {
      richText.push({
        type: 'text',
        text: { content: match.content },
        annotations: { code: true }
      });
    } else if (match.type === 'link') {
      // Validate URL before adding link
      if (isValidUrl(match.url)) {
        richText.push({
          type: 'text',
          text: { content: match.content, link: { url: match.url } }
        });
      } else {
        // If invalid URL, just add as plain text
        richText.push({
          type: 'text',
          text: { content: `[${match.content}](${match.url})` }
        });
      }
    }
    
    currentPos = match.end;
  });
  
  // Add remaining plain text
  if (currentPos < text.length) {
    const plainText = text.substring(currentPos);
    if (plainText) {
      richText.push({ type: 'text', text: { content: plainText } });
    }
  }
  
  return richText.length > 0 ? richText : [{ type: 'text', text: { content: text } }];
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}