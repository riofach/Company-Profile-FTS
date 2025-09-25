# 🚀 Simple Railway Deployment Guide

## 📋 Minimal Setup untuk Deploy

Berikut adalah setup paling sederhana untuk deploy ke Railway tanpa error healthcheck.

## ⚙️ Configuration Files

### **1. railway.toml (FINAL)**

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"
restartPolicyType = "ON_FAILURE"

[[services]]
internalPort = 3000
```

### **2. package.json Scripts**

```json
{
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview --port 3000 --host 0.0.0.0",
		"start": "npm run preview"
	}
}
```

### **3. Dockerfile (MINIMAL)**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

## 🚀 Quick Deploy Steps

### **Step 1: Install Railway CLI**

```bash
npm i -g @railway/cli
```

### **Step 2: Login dan Deploy**

```bash
# Login to Railway
railway login

# Deploy (otomatis detect dan build)
railway up

# Check logs
railway logs --follow
```

### **Step 3: Test Deployment**

```bash
# Get your app URL
railway domain

# Test if working
curl https://your-app.railway.app/
```

## 🔧 If Still Getting Healthcheck Errors

### **Option 1: Force Deploy**

```bash
railway up --force
```

### **Option 2: Check Service Status**

```bash
railway service
```

### **Option 3: Manual Health Check**

```bash
# Test health manually
curl https://your-app.railway.app/

# Check Railway dashboard logs
railway open
```

## 📁 Clean Project Structure

```
/Company-Profile-FTS/
├── 📄 railway.toml          # Railway config (SIMPLE)
├── 📄 Dockerfile            # Docker config (MINIMAL)
├── 📄 package.json          # Scripts (SIMPLE)
├── 📄 vite.config.ts        # Vite config
├── 📁 src/                  # Source code
├── 📁 public/               # Static assets
│   ├── 📄 robots.txt        # SEO
│   ├── 📄 sitemap.xml       # SEO
│   └── 📁 images/           # Images
├── 📄 railway.md            # Full guide
└── 📄 README.md             # Documentation
```

## 🎯 What Was Removed

- ❌ `health.json` - Tidak diperlukan
- ❌ `nginx.conf` - Railway handle sendiri
- ❌ Complex build scripts - Gunakan default
- ❌ Multiple Docker stages - Single stage cukup
- ❌ Environment variables - Minimal setup

## ✅ Expected Results

- ✅ **Build berhasil** tanpa TypeScript errors
- ✅ **Deploy berhasil** tanpa healthcheck issues
- ✅ **App accessible** di Railway URL
- ✅ **Zero-downtime** deployment
- ✅ **Automatic SSL** certificate

## 🚨 If Still Failing

### **Check Railway Logs:**

```bash
railway logs --follow
```

### **Common Issues:**

1. **Build Error**: Check if all dependencies terinstall
2. **Port Error**: Pastikan internalPort = 3000
3. **Healthcheck Error**: Railway akan retry otomatis

### **Force Redeploy:**

```bash
railway up --force
```

## 🎉 Success Indicators

- ✅ Railway shows "Deployment successful"
- ✅ App loads di browser
- ✅ No healthcheck failures
- ✅ All pages accessible
- ✅ Console tanpa errors

---

**Setup ini adalah konfigurasi paling minimal yang bisa deploy dengan cepat ke Railway tanpa error healthcheck.**
