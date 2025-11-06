// Import the getCurrentCodeInfo function from get-code
const { getCurrentCodeInfo } = require('./get-code');

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    const submittedCode = body.code;

    if (!submittedCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Code is required',
          valid: false
        })
      };
    }

    // Get the current valid code
    const { code: currentCode } = getCurrentCodeInfo();

    // Compare codes (case-insensitive)
    const isValid = submittedCode.toUpperCase() === currentCode.toUpperCase();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: isValid,
        message: isValid ? 'Code is correct!' : 'Code is incorrect.'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        valid: false
      })
    };
  }
};
