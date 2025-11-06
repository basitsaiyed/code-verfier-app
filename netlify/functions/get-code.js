// Generate a deterministic code based on the current 15-minute time slot
// This ensures all function instances generate the same code for the same time period
function generateCodeForTimeSlot(timestamp) {
  const fifteenMinutes = 15 * 60 * 1000;

  // Get the current 15-minute slot (rounds down to nearest 15-minute boundary)
  const timeSlot = Math.floor(timestamp / fifteenMinutes);

  // Use the time slot as a seed for deterministic random generation
  // Simple seeded random number generator
  let seed = timeSlot;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(random() * characters.length));
  }

  return code;
}

// Get current code and time info
function getCurrentCodeInfo() {
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;

  // Get the start of the current 15-minute slot
  const currentSlotStart = Math.floor(now / fifteenMinutes) * fifteenMinutes;
  const nextSlotStart = currentSlotStart + fifteenMinutes;

  // Generate code for current time slot
  const code = generateCodeForTimeSlot(now);

  // Time remaining until next code
  const timeRemaining = nextSlotStart - now;

  return {
    code,
    expiresIn: Math.floor(timeRemaining / 1000) // seconds
  };
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
    const codeInfo = getCurrentCodeInfo();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(codeInfo)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Export function for verify endpoint to use
exports.getCurrentCodeInfo = getCurrentCodeInfo;
