const OpenAI = require('openai');

exports.handler = async (event, context) => {
    // Check for POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const currentClientSecret = body.currentClientSecret;

        if (!currentClientSecret) {
            throw new Error("currentClientSecret is required for refresh");
        }

        // Retrieve API keys from Netlify's environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        const chatkitWorkflowId = process.env.CHATKIT_WORKFLOW_ID;

        if (!apiKey) {
            throw new Error("OpenAI API key not configured.");
        }
        if (!chatkitWorkflowId) {
            throw new Error("ChatKit workflow ID not configured.");
        }

        const openai = new OpenAI({ apiKey });

        // Refresh the ChatKit session
        const session = await openai.chatkit.sessions.create({
            workflow_id: chatkitWorkflowId,
            client_secret: currentClientSecret
        });

        // Return the new client_secret from the secure backend
        return {
            statusCode: 200,
            body: JSON.stringify({ client_secret: session.client_secret })
        };
    } catch (error) {
        console.error("Error refreshing ChatKit session:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
