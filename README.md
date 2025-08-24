# KXGuard PIN Collection System - Next.js

A modern, secure web application for collecting and managing device PINs, built with **Next.js 14** and **React 18**.

## 🚀 **Features**

- 🔐 **Secure PIN collection** with validation
- 📊 **Admin dashboard** for viewing collected data
- 📥 **CSV export** functionality
- ⚡ **Next.js 14** with App Router
- 🎨 **Modern React components** with TypeScript
- 🛡️ **Security features**: input validation, CORS protection
- 📱 **Responsive, modern UI**
- 🔄 **Server-side API routes**

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd kxguard-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to** `http://localhost:3000`

## 🔧 **Project Structure**

```
kxguard-nextjs/
├── app/                    # ✅ Next.js App Router
│   ├── api/               # ✅ API routes
│   │   ├── save-pin/      # ✅ PIN submission endpoint
│   │   ├── get-pins/      # ✅ PIN retrieval endpoint
│   │   ├── export-pins/   # ✅ CSV export endpoint
│   │   └── health/        # ✅ Health check endpoint
│   ├── components/        # ✅ React components
│   │   ├── PinForm.tsx    # ✅ PIN input form
│   │   └── AdminPanel.tsx # ✅ Admin dashboard
│   ├── globals.css        # ✅ Global styles
│   ├── layout.tsx         # ✅ Root layout
│   └── page.tsx           # ✅ Main page
├── package.json           # ✅ Next.js dependencies
├── next.config.js         # ✅ Next.js configuration
├── tsconfig.json          # ✅ TypeScript configuration
└── README.md              # ✅ This file
```

## 🌐 **API Endpoints**

### **POST** `/api/save-pin`
Submit a new PIN entry.

**Request Body:**
```json
{
  "pin": "123456",
  "ts": "2024-01-01T00:00:00.000Z",
  "ua": "Mozilla/5.0..."
}
```

### **GET** `/api/get-pins`
Retrieve all stored PIN entries.

### **GET** `/api/export-pins`
Download PIN data as CSV file.

### **GET** `/api/health`
Health check endpoint.

## 🔐 **Admin Access**

- **Username**: `admin` (client-side only)
- **Password**: `admin123` (client-side only)

⚠️ **Important**: This is basic client-side authentication. Implement proper server-side auth for production!

## 💾 **Data Storage**

**Current Implementation**: In-memory storage (resets on deployment)

**For Production**: Integrate with:
- **MongoDB Atlas** (free tier available)
- **Supabase** (PostgreSQL with real-time features)
- **Vercel KV** (Redis-compatible)
- **PlanetScale** (MySQL-compatible)

## 🛡️ **Security Features**

- ✅ **Input validation** and sanitization
- ✅ **TypeScript** for type safety
- ✅ **Security headers** (XSS protection, content type options)
- ✅ **Error handling** and logging
- ✅ **Rate limiting** (can be added via middleware)

## 🔄 **Development Commands**

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 **Environment Variables**

Create a `.env.local` file for local development:

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚨 **Production Considerations**

1. **Change default admin credentials**
2. **Set up proper database integration**
3. **Implement server-side authentication**
4. **Add rate limiting middleware**
5. **Set up monitoring and logging**
6. **Configure CORS for your domain**

## 📊 **Deployment Options**

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Other Platforms**
- **Netlify**: Supports Next.js
- **Railway**: Easy deployment
- **DigitalOcean App Platform**: Scalable hosting
- **AWS/GCP**: Enterprise solutions

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Port already in use**: Change port in `.env.local`
2. **TypeScript errors**: Run `npm run lint` to check
3. **Build errors**: Check `npm run build` output
4. **API not working**: Verify API routes in `app/api/`

### **Development Tips:**

- Use `console.log()` for debugging
- Check browser console for errors
- Use React DevTools for component debugging
- Check Network tab for API calls

## 📄 **License**

MIT License - see LICENSE file for details.

## 🤝 **Support**

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **React Documentation**: [react.dev](https://react.dev)
- **TypeScript Documentation**: [typescriptlang.org](https://typescriptlang.org)
- **Issues**: Create an issue in this repository

---

**Ready to build?** Start with `npm run dev` and build your secure PIN collection system! 🚀
