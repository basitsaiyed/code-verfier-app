// API endpoints (will work both locally and on Netlify)
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions';

let currentCode = null;
let expiresAt = null;
let timerInterval = null;

// Fetch the current code from the API
async function fetchCode() {
    try {
        const response = await fetch(`${API_BASE}/get-code`);
        const data = await response.json();

        currentCode = data.code;
        expiresAt = Date.now() + (data.expiresIn * 1000);

        // Update UI
        document.getElementById('code').textContent = data.code;

        // Start timer
        startTimer();
    } catch (error) {
        console.error('Error fetching code:', error);
        document.getElementById('code').textContent = 'Error loading code';
    }
}

// Update the countdown timer
function updateTimer() {
    if (!expiresAt) return;

    const now = Date.now();
    const remaining = Math.max(0, expiresAt - now);

    if (remaining === 0) {
        // Code expired, fetch new one
        fetchCode();
        return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    document.getElementById('timer').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Start the countdown timer
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

// Copy code to clipboard
async function copyCode() {
    const codeElement = document.getElementById('code');
    const copyBtn = document.getElementById('copyBtn');

    try {
        await navigator.clipboard.writeText(currentCode);

        // Visual feedback
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = 'Copy Code';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentCode;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }
}

// Event listeners
document.getElementById('copyBtn').addEventListener('click', copyCode);

// Initialize
fetchCode();

// Refresh code every 15 minutes (as backup to timer expiry)
setInterval(fetchCode, 15 * 60 * 1000);
