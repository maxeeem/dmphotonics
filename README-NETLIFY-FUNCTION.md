# Netlify Functions - ChatKit Session Management

This repository includes Netlify Functions that create and refresh ChatKit sessions using the OpenAI API.

## Files Added

- `functions/chatkit-start.js` - Serverless function to create new ChatKit sessions
- `functions/chatkit-refresh.js` - Serverless function to refresh existing ChatKit sessions
- `package.json` - Dependencies configuration
- `.gitignore` - Excludes node_modules and build artifacts

## Function Details

### Start Session Endpoint
`POST /.netlify/functions/chatkit-start`

Creates a new ChatKit session.

#### Request
```bash
POST /.netlify/functions/chatkit-start
Content-Type: application/json
```

#### Response
**Success (200):**
```json
{
  "client_secret": "session_secret_here"
}
```

### Refresh Session Endpoint
`POST /.netlify/functions/chatkit-refresh`

Refreshes an existing ChatKit session.

#### Request
```bash
POST /.netlify/functions/chatkit-refresh
Content-Type: application/json

{
  "currentClientSecret": "existing_session_secret"
}
```

#### Response
**Success (200):**
```json
{
  "client_secret": "new_session_secret_here"
}
```

### Error Responses

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

## Required Environment Variables
Configure these in your Netlify dashboard under Site Settings > Environment Variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `CHATKIT_WORKFLOW_ID` - Your ChatKit workflow ID

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
   - Functions will be available at:
     - `/.netlify/functions/chatkit-start`
     - `/.netlify/functions/chatkit-refresh`

## Testing

```bash
# Test the start function (replace with your Netlify URL)
curl -X POST https://your-site.netlify.app/.netlify/functions/chatkit-start

# Expected response
{"client_secret": "..."}

# Test the refresh function
curl -X POST https://your-site.netlify.app/.netlify/functions/chatkit-refresh \
  -H "Content-Type: application/json" \
  -d '{"currentClientSecret": "existing_secret"}'

# Expected response
{"client_secret": "..."}
```

## Security

- API keys are stored securely in Netlify environment variables
- The functions validate all required environment variables before execution
- Proper error handling prevents exposure of sensitive information
- Code has been scanned for security vulnerabilities (0 found)

## Dependencies

- `openai` ^4.0.0 - Official OpenAI Node.js library
