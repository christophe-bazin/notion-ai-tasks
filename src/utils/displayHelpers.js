export function displayContentWithHierarchy(blocks) {
  displayBlocksWithDepth(blocks, 0);
}

function displayBlocksWithDepth(blocks, depth) {
  blocks.forEach((block, index) => {
    const indent = '  '.repeat(depth);
    
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text && block.paragraph.rich_text.length > 0) {
          console.log(`${indent}${block.paragraph.rich_text[0].plain_text}`);
        }
        break;
      case 'heading_1':
        console.log(`${indent}# ${block.heading_1.rich_text[0]?.plain_text || ''}`);
        break;
      case 'heading_2':
        console.log(`${indent}## ${block.heading_2.rich_text[0]?.plain_text || ''}`);
        break;
      case 'heading_3':
        console.log(`${indent}### ${block.heading_3.rich_text[0]?.plain_text || ''}`);
        break;
      case 'bulleted_list_item':
        console.log(`${indent}- ${block.bulleted_list_item.rich_text[0]?.plain_text || ''}`);
        if (block.children && block.children.length > 0) {
          displayBlocksWithDepth(block.children, depth + 1);
        }
        break;
      case 'numbered_list_item':
        console.log(`${indent}${index + 1}. ${block.numbered_list_item.rich_text[0]?.plain_text || ''}`);
        if (block.children && block.children.length > 0) {
          displayBlocksWithDepth(block.children, depth + 1);
        }
        break;
      case 'to_do':
        const checked = block.to_do.checked ? '☑' : '☐';
        const text = block.to_do.rich_text[0]?.plain_text || '';
        console.log(`${indent}${checked} ${text}`);
        
        if (block.children && block.children.length > 0) {
          displayBlocksWithDepth(block.children, depth + 1);
        }
        break;
      case 'code':
        console.log(`${indent}\`\`\`${block.code.language || ''}`);
        console.log(`${indent}${block.code.rich_text[0]?.plain_text || ''}`);
        console.log(`${indent}\`\`\``);
        break;
      case 'quote':
        console.log(`${indent}> ${block.quote.rich_text[0]?.plain_text || ''}`);
        break;
      default:
        console.log(`${indent}[${block.type}] ${JSON.stringify(block[block.type])}`);
    }
  });
}

export function displayTaskInfo(task) {
  console.log(`\n📋 Task: ${task.title}`);
  console.log(`🔄 Status: ${task.status}`);
  console.log(`⚡ Priority: ${task.priority}`);
  console.log(`📝 Type: ${task.type}`);
  console.log(`🆔 ID: ${task.id}`);
  console.log(`🔗 URL: ${task.url}`);
  console.log(`Created: ${new Date(task.createdTime).toLocaleDateString()}`);
  console.log(`Last edited: ${new Date(task.lastEditedTime).toLocaleDateString()}`);
}

export function displayTaskList(tasks) {
  if (tasks.length === 0) {
    console.log('No tasks found matching your criteria.');
    return;
  }

  console.log(`\n📋 Found ${tasks.length} tasks:\n`);
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.title || 'Untitled'}`);
    console.log(`   Status: ${task.status} | Priority: ${task.priority} | Type: ${task.type}`);
    console.log(`   ID: ${task.id}`);
    console.log(`   URL: ${task.url}`);
    console.log('');
  });
}

export function displaySuccess(message) {
  console.log(`✅ ${message}`);
}

export function displayError(message) {
  console.error(`❌ ${message}`);
}

export function displayInfo(message) {
  console.log(`ℹ️  ${message}`);
}