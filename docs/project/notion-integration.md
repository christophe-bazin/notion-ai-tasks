# Notion Integration - notion-ai-tasks

## Notion-Specific Rules

### **API Integration Best Practices:**
- **Case-insensitive matching** - Match property names ignoring case (Notion vs config differences)
- **Type validation** - Ensure properties match expected Notion types
- **Graceful degradation** - Handle missing optional config (like testStatus) with warnings
- **Status validation** - Validate that configured statuses exist in Notion database
- **Rate limiting** - Respect Notion API rate limits with proper delays

### **Error Handling:**
```javascript
try {
  // Notion API call
} catch (error) {
  console.error('Error [specific operation]:', error);
  throw error;
}
```

## Configuration Structure

### **Configuration Files:**
- **notion-tasks.config.json** - In project root, not in package
- **Keep examples updated** - Sync with actual configuration structure
- **Document all options** - Every config property should be documented

### **Required Configuration:**
```json
{
  "notionToken": "your-integration-token",
  "databaseId": "your-database-id",
  "statusProperty": "Status",
  "titleProperty": "Name",
  "statuses": {
    "todo": "To Do",
    "inProgress": "In Progress",
    "done": "Done"
  }
}
```

### **Optional Configuration:**
```json
{
  "testStatus": "Test",
  "contentProperty": "Content",
  "priorityProperty": "Priority",
  "assigneeProperty": "Assignee"
}
```

## API Usage Patterns

### **Status Management:**
- Always validate status values against Notion database
- Handle case sensitivity differences between config and Notion
- Provide clear error messages for invalid statuses

### **Content Management:**
- Support rich text blocks for task content
- Handle markdown to Notion blocks conversion
- Preserve formatting when updating content

### **Task Creation:**
- Validate required properties before API calls
- Set appropriate defaults for optional properties
- Handle duplicate task detection

### **Task Updates:**
- Only update changed properties to minimize API calls
- Batch operations when possible
- Provide feedback on successful updates

## Rate Limiting

### **API Limits:**
- Notion API has rate limits (3 requests per second)
- Implement exponential backoff for failed requests
- Batch operations to reduce total API calls

### **Best Practices:**
```javascript
// Batch process users to avoid rate limiting Notion API
for (const user of userBatch) {
  await processWithDelay(user);
}
```

## Error Scenarios

### **Common Issues:**
1. **Invalid token** - Clear setup instructions
2. **Database not found** - Validate database ID
3. **Missing properties** - Check property names match Notion
4. **Permission issues** - Verify integration permissions
5. **Rate limit exceeded** - Implement retry logic

### **Error Messages:**
- **Specific and actionable** - Tell user exactly what's wrong
- **Include context** - What operation was being attempted
- **No generic messages** - Avoid "Something went wrong"