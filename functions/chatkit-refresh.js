// Use direct HTTP calls to OpenAI ChatKit REST endpoint to avoid SDK mismatches.
// This file is a Netlify function that refreshes a ChatKit session.

// Prefer global fetch (Node 18+). If not available, try to require 'node-fetch'.
let fetchFn = globalThis.fetch;
if (!fetchFn) {
    try {
        // eslint-disable-next-line import/no-extraneous-dependencies
        fetchFn = require('node-fetch');
    } catch (e) {
        // Leave fetchFn undefined; we'll throw later if needed.
    }
}

exports.handler = async (event, context) => {
    // Check for POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body || '{}');
        const currentClientSecret = body.currentClientSecret;

        if (!currentClientSecret) {
            throw new Error('currentClientSecret is required for refresh');
        }

        // Retrieve API keys from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        const chatkitWorkflowId = process.env.CHATKIT_WORKFLOW_ID;

        if (!apiKey) {
            throw new Error('OpenAI API key not configured.');
        }
        if (!chatkitWorkflowId) {
            throw new Error('ChatKit workflow ID not configured.');
        }

        if (!fetchFn) {
            throw new Error('fetch is not available in this runtime. Install node-fetch or use Node 18+.');
        }

        // Refresh the ChatKit session by providing the client_secret
                const resp = await fetchFn('https://api.openai.com/v1/chatkit/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                    'OpenAI-Beta': 'chatkit_beta=v1',
                },
                            // ChatKit expects `workflow` as an object (e.g. { id: 'wf_...' })
                            body: JSON.stringify({ workflow: { id: chatkitWorkflowId }, client_secret: currentClientSecret }),
            });

        const data = await resp.json();

        if (!resp.ok) {
            const msg = data?.error?.message || `OpenAI ChatKit error: ${resp.status}`;
            throw new Error(msg);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ client_secret: data.client_secret }),
        };
    } catch (error) {
        console.error('Error refreshing ChatKit session:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
