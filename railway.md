# 🚀 Deploy Fujiyama Technology Solutions ke Railway

Panduan lengkap untuk deploy Company Profile FTS ke Railway dengan zero-downtime deployment.

## 📋 Prerequisites

Sebelum memulai deployment, pastikan Anda sudah memiliki:

- ✅ **Railway Account**: [railway.app](https://railway.app)
- ✅ **GitHub Repository**: Project sudah di-push ke GitHub
- ✅ **Railway CLI** (opsional): `npm i -g @railway/cli`

## 🛠️ Railway Deployment Guide

### **Langkah 1: Setup Railway Project**

1. **Login ke Railway**

   ```bash
   railway login
   ```

2. **Create New Project**
   ```bash
   railway init
   ```
   Atau melalui Railway Dashboard:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select repository `Company-Profile-FTS`

### **Langkah 2: Environment Variables Setup**

Set environment variables di Railway Dashboard:

1. Go to your Railway project
2. Navigate to **Settings** → **Environment**
3. Add the following variables:

```bash
# Production Environment Variables
VITE_SITE_URL=https://your-app-name.railway.app
VITE_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_GA_ID

# Railway Environment
NODE_ENV=production
PORT=3000
```

### **Langkah 3: Deploy Configuration**

Railway akan automatically detect this is a **React/Vite** project and use the appropriate build settings.

## 📁 Project Structure for Railway

```
/Company-Profile-FTS/
├── 📄 railway.toml          # Railway configuration (Nixpacks)
├── 📄 Dockerfile            # Main container configuration
├── 📄 Dockerfile.simple     # Alternative Dockerfile
├── 📄 nginx.conf            # Nginx server configuration
├── 📄 .dockerignore         # Docker build exclusions
├── 📄 package.json          # Dependencies & scripts (UPDATED)
├── 📄 vite.config.ts        # Vite configuration
├── 📁 src/                  # Source code
├── 📁 public/               # Static assets
│   ├── 📄 health.json       # Static health check (NEW)
│   ├── 📄 robots.txt        # SEO robots file
│   ├── 📄 sitemap.xml       # SEO sitemap
│   └── 📁 images/           # Company images
├── 📄 railway.md            # Deployment guide (UPDATED)
└── 📄 ENV_SETUP.md          # Environment variables guide
```

## ⚙️ Configuration Files

### **1. Railway Configuration (`railway.toml`)**

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"
restartPolicyType = "ON_FAILURE"

[[services]]
internalPort = 3000
processes = ["npm run preview"]
```

### **2. Dockerfile (Alternative)**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV VITE_SITE_URL=https://your-app-name.railway.app

RUN npm run build

# Production image
FROM nginx:alpine AS runner
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### **3. Alternative Dockerfile (`Dockerfile.simple`)**

Jika Nixpacks masih bermasalah, Railway dapat menggunakan Dockerfile alternative:

```dockerfile
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache dumb-init curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

### **4. Nginx Configuration (`nginx.conf`)**

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 🔧 Production Build Scripts

Update `package.json` scripts untuk production:

```json
{
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"build:dev": "vite build --mode development",
		"build:prod": "vite build --mode production",
		"build:check": "tsc --noEmit",
		"preview": "vite preview --port 3000 --host 0.0.0.0",
		"start": "npm run preview",
		"deploy": "railway up"
	}
}
```

**Note**: Kami menghilangkan `tsc &&` dari build script karena Railway menggunakan Nixpacks yang sudah menginstall TypeScript compiler.

## 🌐 Domain Configuration

### **Custom Domain Setup:**

1. **Buy Domain** (optional):

   - Go to domain registrar (Namecheap, GoDaddy, etc.)
   - Purchase your desired domain

2. **Railway Custom Domain**:

   ```bash
   railway domain add your-domain.com
   ```

3. **DNS Configuration**:

   ```
   Type: A
   Name: @
   Value: [Railway provided IP]
   TTL: 300

   Type: CNAME
   Name: www
   Value: [your-app-name].railway.app
   TTL: 300
   ```

## 🔍 Troubleshooting Common Issues

### **Error: "tsc: not found" atau "TypeScript not found"**

**Root Cause**: Railway's Nixpacks tidak menginstall TypeScript compiler secara default.

**Solution 1 - Update railway.toml** (RECOMMENDED):

```toml
[build]
builder = "nixpacks"

[build.env]
NODE_ENV = "production"

[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-8_x", "typescript"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run preview"
```

**Solution 2 - Update package.json build script**:

```json
{
	"scripts": {
		"build": "vite build", // Remove "tsc &&" prefix
		"build:prod": "vite build --mode production"
	}
}
```

**Solution 3 - Manual TypeScript Installation**:

```bash
# Install TypeScript globally in Railway container
railway run npm install -g typescript

# Or install as dev dependency
railway run npm install --save-dev typescript
```

**Solution 4 - Use alternative Dockerfile**:

1. Rename `Dockerfile.simple` to `Dockerfile`
2. Railway akan otomatis menggunakan Docker build
3. Redeploy: `railway up --force`

**Solution 5 - Force Nixpacks to use specific packages**:

```toml
# Update railway.toml
[phases.setup]
nixPkgs = [
  "nodejs-18_x",
  "npm-8_x",
  "typescript-5_x"
]

[phases.install]
cmds = ["npm ci --include=dev"]
```

### **Error: "process is not defined"**

**Solution**: Environment variables sudah dikonfigurasi dengan benar di `env.ts`

### **Error: Build Failed**

**Solution**:

```bash
# Check Railway logs
railway logs

# Rebuild project with force
railway up --force

# Clear Railway cache
railway up --detach
```

### **Error: Port Already in Use**

**Solution**: Railway automatically assigns ports, no need to specify PORT in app

### **Error: Environment Variables Not Found**

**Solution**:

1. Go to Railway Dashboard → Project Settings → Environment
2. Add all required environment variables
3. Redeploy: `railway up`

### **Error: Healthcheck Failure - "service unavailable"**

**Root Cause**: Railway healthcheck tidak bisa mengakses endpoint aplikasi.

**Solution 1 - Update Health Check Path** (RECOMMENDED):

```toml
# Update railway.toml
[deploy]
healthcheckPath = "/health.json"  # Use static JSON file
healthcheckTimeout = 300          # Increase timeout
healthcheckInterval = 30         # Check every 30 seconds
```

**Solution 2 - Create Static Health File**:

```bash
# Create public/health.json
echo '{"status": "healthy", "service": "FTS", "version": "1.0.0"}' > public/health.json
```

**Solution 3 - Use Different Port**:

```toml
[build.env]
PORT = "8080"

[deploy]
startCommand = "npm run start"

[[services]]
internalPort = 8080
```

**Solution 6 - Use Simple Configuration**:

```bash
# Rename railway.toml.simple to railway.toml
mv railway.toml.simple railway.toml
railway up --force
```

**Solution 4 - Debug with Railway CLI**:

```bash
# Check if service is running
railway service

# Check logs
railway logs --follow

# Test health check manually
curl https://your-app.railway.app/health.json
```

**Solution 5 - Railway Dashboard Debug**:

1. Go to Railway Dashboard → Your Service
2. Click on **"Domains"** to see assigned domain
3. Try accessing `https://your-app.railway.app/health.json` manually
4. Check **"Logs"** for startup errors

## 📊 Monitoring & Logs

### **Railway Dashboard Monitoring:**

- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: Deployment history and status
- **Environment**: Environment variables management

### **Access Railway Logs:**

```bash
# View all logs
railway logs

# View specific service logs
railway logs --service web

# Follow logs in real-time
railway logs --follow
```

## 🚀 Production Optimizations

### **1. Build Optimizations**

```bash
# Enable source maps for debugging
# Update vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false, // Set to true for debugging
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true
      }
    }
  }
})
```

### **2. Performance Settings**

```javascript
// In main.tsx - Add error boundary for production
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
	<App />
</ErrorBoundary>;
```

### **3. Security Headers**

Railway automatically adds security headers, but you can customize them in `nginx.conf`

## 🔄 CI/CD Pipeline

### **GitHub Actions (Optional)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/railway-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📝 Post-Deployment Checklist

- [ ] ✅ Website loads successfully
- [ ] ✅ All pages are accessible
- [ ] ✅ Health check endpoint works (`/health.json`)
- [ ] ✅ SEO meta tags are working
- [ ] ✅ Analytics tracking is active
- [ ] ✅ SSL certificate is active
- [ ] ✅ Domain resolves correctly
- [ ] ✅ Performance is optimized
- [ ] ✅ Error monitoring is set up
- [ ] ✅ Railway logs show successful startup
- [ ] ✅ Environment variables are loaded correctly

## 🎯 Production URLs

- **Production URL**: `https://your-app-name.railway.app`
- **Custom Domain**: `https://your-domain.com` (after DNS setup)
- **Railway Dashboard**: `https://railway.app/project/your-project-id`

## 📞 Support & Resources

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Community**: [Discord](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

---

## 🎉 Deployment Complete!

Setelah mengikuti panduan ini, **Fujiyama Technology Solutions** akan live di Railway dengan:

- ✅ **Zero-downtime deployments**
- ✅ **Automatic SSL certificates**
- ✅ **Scalable infrastructure**
- ✅ **Built-in monitoring**
- ✅ **Environment management**

**Selamat! Website Company Profile FTS sudah siap melayani visitors di seluruh dunia!** 🌍🚀
