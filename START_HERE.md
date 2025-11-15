# 🍔 Calorie Scanner - Quick Start

## ✅ Setup Complete!

Everything is installed and ready to go. You just need to add your Anthropic API key.

## 🔑 Step 1: API Key Already Configured! ✅

Your Gemini API key is already set up in the `.env` file.

If you need to change it later:
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update the `.env` file:
```bash
GEMINI_API_KEY=your-new-key-here
```

## 🚀 Step 3: Start the App

```bash
npm start
```

This starts both servers:
- ✅ Backend proxy: http://localhost:3001
- ✅ Frontend app: http://localhost:8080

## 🎯 Step 4: Use the Scanner

Open your browser:
```
http://localhost:8080/scanner
```

1. Upload a food image (drag & drop or click)
2. Click "Analyze Food"
3. See the calorie breakdown!

## 🔧 Alternative: Run Separately

If `npm start` doesn't work, run in two terminals:

**Terminal 1:**
```bash
npm run server
```

**Terminal 2:**
```bash
npm run dev
```

## ❓ Troubleshooting

### "API Key not configured" error
- Make sure you saved the `.env` file
- Restart the server after adding the key
- Check that the key starts with `AIza`

### Can't access the page
- Make sure both servers are running
- Try http://localhost:8080/scanner (note the port)
- Check the terminal for error messages

### Image won't upload
- Try a smaller image (< 5MB recommended)
- Supported formats: JPG, PNG, WebP

## 📁 What Was Created

```
wolt-local-guide/
├── .env                          # Your API key (DO NOT COMMIT)
├── server/
│   └── proxy.js                  # Backend server for API calls
├── src/
│   └── components/
│       └── CalorieScanner.tsx    # Main component
└── CALORIE_SCANNER_README.md     # Full documentation
```

## 🎉 You're Ready!

Just add your API key and run `npm start`!
