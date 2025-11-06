// Store to keep the current code and timestamp
// In production, this would be better in a database or KV store
// But for a simple Netlify function, we'll use a global variable
let currentCode = null;
let lastGenerated = null;

// Generate a random 8-digit alphanumeric code
function generateCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Check if we need to generate a new code (every 15 minutes)
function getCurrentCode() {
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  if (!currentCode || !lastGenerated || (now - lastGenerated) >= fifteenMinutes) {
    currentCode = generateCode();
    lastGenerated = now;
  }

  return currentCode;
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const code = getCurrentCode();
    const timeRemaining = 15 * 60 * 1000 - (Date.now() - lastGenerated);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        code: code,
        expiresIn: Math.floor(timeRemaining / 1000) // seconds remaining
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Export functions for verify endpoint to use
exports.getCurrentCode = getCurrentCode;
