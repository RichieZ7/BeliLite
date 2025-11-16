# Troubleshooting xAI Grok API Integration

## 404 Error When Summarizing

If you're getting a 404 error when trying to summarize text, it means the API endpoint URL is incorrect.

### Steps to Fix:

1. **Check xAI Documentation**
   - Visit https://docs.x.ai or https://console.x.ai
   - Look for the API documentation
   - Find the correct endpoint URL for chat completions

2. **Verify Your API Key**
   - Make sure your `XAI_API_KEY` in `.env` is correct
   - Check that the API key is active and has proper permissions
   - You can regenerate it at https://console.x.ai if needed

3. **Try Alternative Endpoints**
   
   Edit your `.env` file and try these endpoint variations:
   
   ```bash
   # Option 1 (current default)
   XAI_API_URL=https://api.x.ai/v1/chat/completions
   
   # Option 2 (without /v1)
   XAI_API_URL=https://api.x.ai/chat/completions
   
   # Option 3 (check xAI docs for the actual endpoint)
   XAI_API_URL=<endpoint-from-xai-docs>
   ```

4. **Check Model Name**
   
   The model name might also be incorrect. Try these in `server.js`:
   - `grok-beta` (current)
   - `grok-2`
   - `grok-2-1212`
   - Check xAI docs for available models

5. **View Detailed Error Logs**
   
   When you try to summarize, check your terminal/console output. The improved error logging will show:
   - The exact URL being called
   - The status code and error message
   - The response from xAI (if any)

### Common Issues:

- **404 Not Found**: Endpoint URL is wrong → Check xAI docs for correct URL
- **401 Unauthorized**: API key is invalid → Check your `.env` file
- **429 Too Many Requests**: Rate limit exceeded → Wait and try again
- **400 Bad Request**: Request format is wrong → Check model name and parameters

### Getting Help:

1. Check the server console for detailed error messages
2. Verify your API key at https://console.x.ai
3. Review xAI's API documentation at https://docs.x.ai
4. Check that your Node.js version is 18+ (required for `fetch` API)

### Quick Test:

To test if your API key works, you can try this in your terminal:

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-beta",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": false
  }'
```

Replace `YOUR_API_KEY` with your actual key. This will help you verify:
- If the endpoint URL is correct
- If your API key is valid
- What the actual response format is

