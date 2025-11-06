# Code Verifier App

A simple web application that generates a random 8-digit alphanumeric code that updates every 15 minutes. Users can copy the code and verify codes through an API endpoint.

## Features

- Random 8-digit alphanumeric code generation
- Auto-refresh every 15 minutes
- Countdown timer showing when the code expires
- One-click copy to clipboard
- Code verification endpoint
- Responsive design
- Deployed on Netlify

## API Endpoints

### GET `/api/get-code`
Returns the current code and expiration time.

**Response:**
```json
{
  "code": "ABC12345",
  "expiresIn": 900
}
```

### POST `/api/verify-code`
Verifies if a submitted code is correct.

**Request:**
```json
{
  "code": "ABC12345"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Code is correct!"
}
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:8888`

## Deployment to Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Netlify Web Interface

1. Push this project to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Netlify will automatically detect the configuration from `netlify.toml`
6. Click "Deploy site"

### Option 3: Drag and Drop

1. Build the project (no build step required for this project)
2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop the entire project folder
4. Your site will be deployed instantly

## Project Structure

```
code-verifier-app/
├── netlify/
│   └── functions/
│       ├── get-code.js       # API endpoint to get current code
│       └── verify-code.js    # API endpoint to verify code
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Styling
│   └── script.js             # Frontend JavaScript
├── netlify.toml              # Netlify configuration
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## How It Works

1. The backend generates a random 8-digit alphanumeric code on first request
2. The code remains valid for 15 minutes
3. After 15 minutes, a new code is automatically generated
4. The frontend displays the current code with a countdown timer
5. Users can copy the code with one click
6. Users can verify codes through the verification input field
7. The verification endpoint checks if the submitted code matches the current valid code

## Technologies Used

- Frontend: HTML, CSS, JavaScript (Vanilla)
- Backend: Netlify Serverless Functions (Node.js)
- Hosting: Netlify

## Notes

- The code is case-insensitive during verification
- The code state is stored in memory (resets on function cold starts)
- For production use with multiple instances, consider using a database or KV store
- CORS is enabled for all origins (configure as needed for production)
