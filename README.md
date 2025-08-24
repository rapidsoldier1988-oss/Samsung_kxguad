# KXGuard PIN Collection System

A secure web application for collecting and managing device PINs with admin functionality.

## Features

- 🔐 Secure PIN collection with validation
- 📊 Admin dashboard for viewing collected data
- 📥 CSV export functionality
- 🚀 Production-ready Express.js backend
- 🛡️ Security features: rate limiting, input validation, CORS protection
- 📱 Responsive, modern UI

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Forth-attempt--main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Production Deployment

1. Install production dependencies:
```bash
npm install --production
```

2. Start the production server:
```bash
npm start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# CORS Configuration (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Data Storage
DATA_DIR=./data
MAX_FILE_SIZE_MB=10

# Security
NODE_ENV=production
```

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## API Endpoints

### POST `/save-pin`
Submit a new PIN entry.

**Request Body:**
```json
{
  "pin": "123456",
  "ts": "2024-01-01T00:00:00.000Z",
  "ua": "Mozilla/5.0..."
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "PIN saved successfully"
}
```

### GET `/get-pins`
Retrieve all stored PIN entries (admin only).

### GET `/export-pins.csv`
Download PIN data as CSV file (admin only).

### GET `/health`
Health check endpoint.

## Security Features

- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ File size limits
- ✅ Error handling and logging
- ✅ Security headers

## File Structure

```
Forth-attempt--main/
├── server.js          # Express.js server
├── index.html         # Frontend application
├── package.json       # Dependencies and scripts
├── data/              # Data storage directory
│   └── pins.json     # PIN data storage
└── README.md         # This file
```

## Data Storage

PINs are stored in `data/pins.json` with the following structure:

```json
[
  {
    "pin": "123456",
    "ts": "2024-01-01T00:00:00.000Z",
    "ua": "Mozilla/5.0...",
    "ip": "192.168.1.1",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Adding New Features

1. Update `server.js` for backend changes
2. Update `index.html` for frontend changes
3. Test thoroughly before deployment
4. Update this README if needed

## Security Considerations

### Production Checklist

- [ ] Change default admin credentials
- [ ] Set up proper authentication system
- [ ] Configure HTTPS
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Data backup strategy
- [ ] Rate limiting configuration
- [ ] CORS origin restrictions

### Known Limitations

- Client-side admin authentication (use server-side in production)
- File-based storage (consider database for large scale)
- No encryption of stored PINs
- Basic rate limiting

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` in environment variables
2. **CORS errors**: Check `ALLOWED_ORIGINS` configuration
3. **Data not saving**: Ensure `data/` directory exists and is writable
4. **Admin access denied**: Verify credentials in the frontend code

### Logs

Check console output for error messages and debugging information.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.
