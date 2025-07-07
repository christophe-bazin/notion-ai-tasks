export async function createCommand(taskManager, title, options) {
  try {
    const taskData = {
      title: title,
      status: options.status,
      priority: options.priority,
      type: options.type
    };

    if (options.content) {
      taskData.content = options.content;
    }

    const task = await taskManager.createTask(taskData);
    console.log('✅ Task created successfully:');
    console.log(`   Title: ${task.title}`);
    console.log(`   Status: ${task.status}`);
    console.log(`   Priority: ${task.priority}`);
    console.log(`   Type: ${task.type}`);
    console.log(`   ID: ${task.id}`);
    console.log(`   URL: ${task.url}`);
  } catch (error) {
    console.error('❌ Error creating task:', error.message);
  }
}