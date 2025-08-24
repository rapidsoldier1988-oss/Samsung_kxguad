# KXGuard PIN Collection System - Vercel Deployment

A secure web application for collecting and managing device PINs, optimized for Vercel serverless deployment.

## 🚀 **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kxguard-project)

### **Quick Deploy Steps:**

1. **Click the Deploy Button Above** or visit [vercel.com/new](https://vercel.com/new)
2. **Import your repository** or upload the project files
3. **Configure environment variables** (optional):
   - `NODE_ENV`: `production`
   - `ALLOWED_ORIGINS`: Your domain(s) separated by commas
4. **Deploy!** Your app will be live in minutes

## ✨ **Features**

- 🔐 **Secure PIN collection** with validation
- 📊 **Admin dashboard** for viewing collected data
- 📥 **CSV export** functionality
- 🚀 **Serverless deployment** on Vercel
- 🛡️ **Security features**: rate limiting, input validation, CORS protection
- 📱 **Responsive, modern UI**

## 🔧 **Project Structure**

```
kxguard-project/
├── server.js          # ✅ Vercel-compatible Express server
├── index.html         # ✅ Frontend application
├── package.json       # ✅ Optimized dependencies
├── vercel.json        # ✅ Vercel configuration
└── README.md          # ✅ This file
```

## 🌐 **API Endpoints**

### **POST** `/save-pin`
Submit a new PIN entry.

**Request Body:**
```json
{
  "pin": "123456",
  "ts": "2024-01-01T00:00:00.000Z",
  "ua": "Mozilla/5.0..."
}
```

### **GET** `/get-pins`
Retrieve all stored PIN entries (admin only).

### **GET** `/export-pins.csv`
Download PIN data as CSV file (admin only).

### **GET** `/health`
Health check endpoint.

## 🔐 **Admin Access**

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials before production use!

## 💾 **Data Storage**

**Note**: This Vercel deployment uses **in-memory storage** which means:
- Data resets on each deployment
- No persistent storage between serverless function calls
- Perfect for testing and demonstration

**For Production Use**: Consider integrating with:
- **MongoDB Atlas** (free tier available)
- **Supabase** (PostgreSQL with real-time features)
- **Vercel KV** (Redis-compatible)
- **PlanetScale** (MySQL-compatible)

## 🛡️ **Security Features**

- ✅ **Rate limiting**: 100 requests per 15 minutes per IP
- ✅ **Input validation** and sanitization
- ✅ **CORS protection** with configurable origins
- ✅ **Security headers** (XSS protection, content type options)
- ✅ **Error handling** and logging

## 🔄 **Local Development**

If you want to test locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📝 **Environment Variables**

Create a `.env` file for local development:

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000
```

## 🚨 **Production Considerations**

1. **Change default admin credentials**
2. **Set up proper database integration**
3. **Configure CORS origins for your domain**
4. **Set up monitoring and logging**
5. **Consider adding authentication middleware**

## 📊 **Vercel Analytics**

After deployment, you can:
- Monitor API usage in Vercel dashboard
- View function execution times
- Track error rates
- Analyze performance metrics

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Function timeout**: Increase timeout in Vercel settings
2. **CORS errors**: Check `ALLOWED_ORIGINS` environment variable
3. **Data not persisting**: This is expected with in-memory storage
4. **Rate limiting**: Adjust limits in `vercel.json` if needed

### **Vercel Dashboard:**

- Check function logs in Vercel dashboard
- Monitor deployment status
- View environment variables

## 📄 **License**

MIT License - see LICENSE file for details.

## 🤝 **Support**

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: Create an issue in this repository
- **Community**: [vercel.com/community](https://vercel.com/community)

---

**Ready to deploy?** Click the Vercel button above and get your KXGuard app live in minutes! 🚀
