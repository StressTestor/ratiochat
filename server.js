import 'dotenv/config';
import express from 'express';
import chatHandler from './api/chat.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Route adapter
app.post('/api/chat', async (req, res) => {
    // Vercel handler expects (req, res)
    // Express req/res are compatible enough for this simple case
    try {
        await chatHandler(req, res);
    } catch (error) {
        console.error("Error in chat handler:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(port, () => {
    console.log(`RatioChat running at http://localhost:${port}`);
});
