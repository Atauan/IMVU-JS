import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { IMVUClient } from './imvu-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Initialize IMVU client
const imvuClient = new IMVUClient();

// Routes
app.post('/api/avatar', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        console.log(`Searching for avatar: ${query}`);
        
        // Try to get user data
        const userData = await imvuClient.getUserData(query);
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                error: 'Avatar não encontrado'
            });
        }

        res.json({
            success: true,
            data: userData
        });

    } catch (error) {
        console.error('Error fetching avatar data:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
});