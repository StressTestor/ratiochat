import OpenAI from 'openai';

const openai = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "https://ratiochat.app",
      "X-Title": "RatioChat",
    },
  })
  : null;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!openai) {
      return res.status(500).json({ error: 'OpenRouter API Key not configured on server' });
    }

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: 'You are RatioChat, a helpful AI assistant for Pi Network Pioneers. You are UNOFFICIAL. You must REFUSE to predict the future price of Pi. If asked about price, state that value depends on utility.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
