import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Demo auth endpoint for local testing (username/password demo)
const DEMO_USER = process.env.DEMO_USER || 'Admin'
const DEMO_PASS = process.env.DEMO_PASS || 'Senha@123'

app.post('/api/demo-auth', (req, res) => {
  const { username, password } = req.body || {}
  if (username === DEMO_USER && password === DEMO_PASS) {
    return res.json({ token: 'demo-token', user: { username: DEMO_USER } })
  }
  return res.status(401).json({ message: 'Invalid credentials' })
})

// Simple in-memory store for MIDAS profiles keyed by token
const midasProfiles = new Map()

app.get('/api/midas/profile', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/, '')
  const profile = midasProfiles.get(token) || null
  return res.json({ profile })
})

app.put('/api/midas/profile', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/, '')
  const profile = req.body || {}
  midasProfiles.set(token, profile)
  return res.json({ profile })
})

// Chat endpoint: forwards messages to external MIDAS API if configured,
// otherwise returns a simple demo response.
app.post('/api/midas/chat', async (req, res) => {
  const { message, context } = req.body || {}
  const apiUrl = process.env.MIDAS_API_URL
  const apiKey = process.env.MIDAS_API_KEY

  if (!apiUrl) {
    // Demo fallback reply
    const reply = `Midas (demo): Recebi sua mensagem: ${message || ''}`
    return res.json({ reply })
  }

  try {
    const headers = { 'Content-Type': 'application/json' }
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, context }),
    })

    const data = await resp.json()

    const reply = data.reply || data.text || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || JSON.stringify(data)

    return res.json({ reply })
  } catch (error) {
    console.error('MIDAS proxy error', error)
    return res.status(500).json({ error: 'Error calling MIDAS API' })
  }
})

// Static frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy for development or production integration
const apiTarget = process.env.API_PROXY_TARGET || process.env.VITE_API_BASE_URL;

if (apiTarget) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      logLevel: 'warn',
    })
  );
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
