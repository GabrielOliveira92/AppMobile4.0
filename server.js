import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

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

app.post('/assistente', async (req, res) => {
  const { pergunta } = req.body || {}
  const lower = String(pergunta || '').toLowerCase()

  if (!pergunta) {
    return res.json({ reply: 'Envie sua pergunta no corpo da requisição.' })
  }

  if (lower.includes('saldo')) {
    return res.json({
      reply: 'Saldo estimado: R$ 12.450,00. Para manter saúde financeira, reserve 20% para impostos e reinvista parte em capital de giro.'
    })
  }

  if (lower.includes('boa prática') || lower.includes('boas práticas') || lower.includes('dica financeira') || lower.includes('conselho financeiro')) {
    return res.json({
      reply: 'Boas práticas: separe finanças pessoais e empresariais, controle fluxo de caixa diário, pague impostos em dia e mantenha reserva para 3-6 meses de despesas.'
    })
  }

  if (lower.includes('cotação') || lower.includes('ação') || lower.includes('ações') || lower.includes('moeda') || lower.includes('dólar') || lower.includes('euro') || lower.includes('btc') || lower.includes('criptomoeda')) {
    const symbol = extractFinanceSymbol(lower)

    try {
      const quote = await fetchFinanceQuote(symbol)
      return res.json({
        reply: `Cotação de ${symbol}: ${quote}`,
        quote,
        symbol,
      })
    } catch (error) {
      console.error('Finance error', error)
      return res.json({ reply: 'Não foi possível obter a cotação no momento. Tente novamente mais tarde.' })
    }
  }

  return res.json({
    reply: 'Desculpe, não entendi sua pergunta. Peça saldo, cotação de ações ou boas práticas financeiras.'
  })
})

function extractFinanceSymbol(lower) {
  if (lower.includes('dólar') || lower.includes('dolár') || lower.includes('dollar')) {
    return 'USD/BRL'
  }
  if (lower.includes('euro')) {
    return 'EUR/BRL'
  }
  if (lower.includes('btc') || lower.includes('bitcoin')) {
    return 'BTC/BRL'
  }

  const match = lower.match(/(?:de|da|do|para|sobre)\s+([A-Za-z\.\^\-]{2,10})/i)
  if (match && match[1]) {
    return match[1].toUpperCase()
  }

  const known = ['IBM', 'AAPL', 'MSFT', 'VALE3.SA', 'PETR4.SA']
  return known.find((symbol) => lower.includes(symbol.toLowerCase())) || 'IBM'
}

async function fetchFinanceQuote(symbol) {
  if (symbol.endsWith('/BRL')) {
    const [from, to] = symbol.split('/')
    return await fetchCurrencyQuote(from, to)
  }

  if (ALPHA_VANTAGE_API_KEY) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`
    const resp = await fetch(url)
    const data = await resp.json()
    const quote = data?.['Global Quote']?.['05. price']
    if (!quote) {
      throw new Error('Quote not found')
    }
    return formatPrice(Number(quote))
  }

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`
  const resp = await fetch(url)
  const data = await resp.json()
  const quote = data?.quoteResponse?.result?.[0]?.regularMarketPrice
  if (!quote) throw new Error('Quote not found')
  return formatPrice(Number(quote))
}

async function fetchCurrencyQuote(from, to) {
  if (ALPHA_VANTAGE_API_KEY) {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${encodeURIComponent(from)}&to_currency=${encodeURIComponent(to)}&apikey=${ALPHA_VANTAGE_API_KEY}`
    const resp = await fetch(url)
    const data = await resp.json()
    const rate = data?.['Realtime Currency Exchange Rate']?.['5. Exchange Rate']
    if (!rate) throw new Error('Currency quote not found')
    return formatPrice(Number(rate))
  }

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(from + to)}=X`
  const resp = await fetch(url)
  const data = await resp.json()
  const quote = data?.quoteResponse?.result?.[0]?.regularMarketPrice
  if (!quote) throw new Error('Currency quote not found')
  return formatPrice(Number(quote))
}

async function fetchFinanceIntraday(symbol, interval = '5min') {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('ALPHA_VANTAGE_API_KEY not configured for intraday')
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&apikey=${ALPHA_VANTAGE_API_KEY}`
  const resp = await fetch(url)
  const data = await resp.json()

  if (data['Note']) {
    throw new Error(data['Note'])
  }
  if (data['Error Message']) {
    throw new Error(data['Error Message'])
  }

  const seriesKey = `Time Series (${interval})`
  const series = data?.[seriesKey]
  if (!series) {
    throw new Error('Intraday data not found')
  }

  const timestamps = Object.keys(series)
  if (timestamps.length === 0) {
    throw new Error('No intraday points returned')
  }

  const latest = timestamps[0]
  const point = series[latest]
  return {
    symbol,
    interval,
    timestamp: latest,
    open: Number(point['1. open']),
    high: Number(point['2. high']),
    low: Number(point['3. low']),
    close: Number(point['4. close']),
    volume: Number(point['5. volume']),
    raw: data,
  }
}

app.get('/api/finance/alpha/intraday', async (req, res) => {
  const symbol = String(req.query.symbol || 'IBM').toUpperCase()
  const interval = String(req.query.interval || '5min')

  if (!ALPHA_VANTAGE_API_KEY) {
    return res.status(400).json({ error: 'ALPHA_VANTAGE_API_KEY not configured' })
  }

  try {
    const intraday = await fetchFinanceIntraday(symbol, interval)
    return res.json(intraday)
  } catch (error) {
    console.error('Intraday error', error)
    return res.status(500).json({ error: String(error) })
  }
})

function formatPrice(value) {
  if (Number.isNaN(value)) return 'N/A'
  return `R$ ${value.toFixed(2)}`
}

// Google Translate proxy
app.post('/api/google/translate', async (req, res) => {
  const { text, target } = req.body || {}
  const googleKey = process.env.GOOGLE_API_KEY

  if (!googleKey) return res.status(400).json({ error: 'GOOGLE_API_KEY not configured' })

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${googleKey}`
    const payload = { q: text, target: target || 'pt' }
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await r.json()
    const translatedText = data && data.data && data.data.translations && data.data.translations[0] && data.data.translations[0].translatedText
    return res.json({ translatedText, raw: data })
  } catch (error) {
    console.error('Translate error', error)
    return res.status(500).json({ error: 'Translate error' })
  }
})

// Google Vision proxy
app.post('/api/google/vision', async (req, res) => {
  const { imageBase64, imageUrl } = req.body || {}
  const googleKey = process.env.GOOGLE_API_KEY

  if (!googleKey) return res.status(400).json({ error: 'GOOGLE_API_KEY not configured' })

  try {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${googleKey}`
    const requests = []

    if (imageBase64) {
      requests.push({ image: { content: imageBase64 }, features: [{ type: 'LABEL_DETECTION', maxResults: 5 }, { type: 'TEXT_DETECTION', maxResults: 5 }] })
    } else if (imageUrl) {
      requests.push({ image: { source: { imageUri: imageUrl } }, features: [{ type: 'LABEL_DETECTION', maxResults: 5 }, { type: 'TEXT_DETECTION', maxResults: 5 }] })
    } else {
      return res.status(400).json({ error: 'imageBase64 or imageUrl required' })
    }

    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requests }) })
    const data = await r.json()
    return res.json({ responses: data.responses || data })
  } catch (error) {
    console.error('Vision error', error)
    return res.status(500).json({ error: 'Vision error' })
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
