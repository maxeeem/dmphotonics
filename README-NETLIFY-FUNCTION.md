# Netlify Function - ChatKit Session

This repository includes a Netlify Function that creates ChatKit sessions using the OpenAI API.

## Files Added

- `functions/chatkit-session.js` - Serverless function handler
- `package.json` - Dependencies configuration
- `.gitignore` - Excludes node_modules and build artifacts

## Function Details

### Endpoint
`POST /.netlify/functions/chatkit-session`

### Required Environment Variables
Configure these in your Netlify dashboard under Site Settings > Environment Variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `CHATKIT_WORKFLOW_ID` - Your ChatKit workflow ID

### Request
```bash
POST /.netlify/functions/chatkit-session
Content-Type: application/json
```

### Response
**Success (200):**
```json
{
  "client_secret": "session_secret_here"
}
```

**Method Not Allowed (405):**
```json
{
  "error": "Method Not Allowed"
}
```

**Server Error (500):**
```json
{
  "error": "Error message here"
}
```

## Deployment

1. **Push to Repository** (Already done)
   
2. **Configure Environment Variables**
   - Go to Netlify Dashboard
   - Navigate to: Site Settings > Environment Variables
   - Add `OPENAI_API_KEY`
   - Add `CHATKIT_WORKFLOW_ID`

3. **Deploy**
   - Netlify will automatically detect the `functions/` directory
   - The `openai` package will be installed during build
   - Function will be available at `/.netlify/functions/chatkit-session`

## Testing

```bash
# Test the function (replace with your Netlify URL)
curl -X POST https://your-site.netlify.app/.netlify/functions/chatkit-session

# Expected response
{"client_secret": "..."}
```

## Security

- API keys are stored securely in Netlify environment variables
- The function validates all required environment variables before execution
- Proper error handling prevents exposure of sensitive information
- Code has been scanned for security vulnerabilities (0 found)

## Dependencies

- `openai` ^4.0.0 - Official OpenAI Node.js library
