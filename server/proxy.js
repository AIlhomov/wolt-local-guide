import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '50mb' }));
app.use(cors());

async function callGeminiWithRetry(url, body, maxRetries = 3, delayMs = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                return { success: true, response };
            }

            const errorData = await response.json();

            if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
                console.log(`Retry ${attempt}/${maxRetries}: API busy, waiting ${delayMs / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                continue;
            }

            return { success: false, status: response.status, error: errorData };
        } catch (error) {
            if (attempt === maxRetries) {
                return { success: false, error: { message: error.message } };
            }
            console.log(`Retry ${attempt}/${maxRetries}: Network error, retrying...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}

app.post('/api/analyze', async (req, res) => {
    try {
        const { image, mediaType } = req.body;

        if (!image || !mediaType) {
            return res.status(400).json({ error: 'Missing image or mediaType' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'GEMINI_API_KEY not configured'
            });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: `Analyze this food image and provide a detailed calorie estimate. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "foods": ["food1", "food2"],
  "totalCalories": 500,
  "breakdown": [
    {"item": "food name", "calories": 300, "portion": "1 serving"}
  ],
  "protein": 20,
  "carbs": 50,
  "fat": 15,
  "confidence": "high",
  "notes": "relevant notes about the estimate"
}`
                    },
                    {
                        inline_data: {
                            mime_type: mediaType,
                            data: image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192,
                response_mime_type: "application/json"
            }
        };

        const result = await callGeminiWithRetry(url, requestBody);

        if (!result.success) {
            const errorMessage = result.error?.error?.message || result.error?.message || 'API request failed';

            if (result.status === 503) {
                return res.status(503).json({
                    error: 'AI service busy - please try again in 5 seconds',
                    userMessage: 'Service temporarily busy. Please wait and try again.'
                });
            }

            if (result.status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    userMessage: 'Too many requests. Please wait 30 seconds.'
                });
            }

            console.error('Gemini API error:', errorMessage);
            return res.status(result.status || 500).json({ error: errorMessage });
        }

        const data = await result.response.json();

        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason === 'MAX_TOKENS') {
            return res.status(500).json({
                error: 'Image too complex - try a clearer photo'
            });
        }

        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            throw new Error('No response from Gemini API');
        }

        let cleanedText = textContent.trim()
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const parsed = JSON.parse(cleanedText);
        res.json(parsed);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: error.message || 'Internal server error',
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to forward requests to Google Gemini API`);

    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  WARNING: GEMINI_API_KEY not found in .env');
    }
});
