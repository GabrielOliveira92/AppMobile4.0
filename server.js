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
