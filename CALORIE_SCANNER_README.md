# Calorie Scanner Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd wolt-local-guide
npm install
```

### 2. Configure API Key
Create a `.env` file in the `wolt-local-guide` folder:
```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

**To get an API key:**
- Go to https://console.anthropic.com/
- Sign up or log in
- Navigate to API Keys section
- Create a new key and copy it

### 3. Run the Application
```bash
npm start
```

This will start both:
- Backend proxy server on http://localhost:3001
- Frontend dev server on http://localhost:8080

### 4. Access the Calorie Scanner
Open your browser and go to:
```
http://localhost:8080/scanner
```

## How It Works

1. **Upload Image**: Drag & drop or click to upload a food image
2. **Analyze**: Click "Analyze Food" button
3. **View Results**: Get calorie estimates, macros breakdown, and confidence level

## Architecture

- **Frontend** (`src/components/CalorieScanner.tsx`): React component with image upload UI
- **Proxy Server** (`server/proxy.js`): Express server that forwards requests to Anthropic API
- **Vite Config**: Routes `/api/*` requests to the proxy server

## Troubleshooting

### API Key Not Working
- Make sure your `.env` file is in the `wolt-local-guide` folder
- Restart the server after adding the API key
- Check console for error messages

### CORS Errors
- The proxy server handles CORS automatically
- Make sure both servers are running

### Image Too Large
- Reduce image size before uploading
- Max size is 50MB (base64 encoded)

## Running Separately

If you prefer to run servers separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Building for Production

```bash
npm run build
```

Note: You'll need to deploy the proxy server separately (e.g., Vercel, Railway, Heroku) and update the API endpoint in production.
