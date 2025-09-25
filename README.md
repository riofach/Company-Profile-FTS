# 🚀 Fujiyama Technology Solutions - Company Profile

**Company Profile Website untuk Fujiyama Technology Solutions (FTS)** - Japanese-rooted IT company providing innovative digital solutions in Indonesia.

## 📋 Project Info

**Lovable URL**: https://lovable.dev/projects/ff4e2fe6-dd6d-4aaa-b724-64270bed3cf3

**Railway Deployment**: https://fujiyama-tech.railway.app

**Technologies**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark/light theme
- 🚀 **Performance Optimized** - Fast loading with Vite and optimized assets
- 📱 **Mobile-First** - Responsive design for all devices
- 🔍 **SEO Ready** - Complete SEO optimization with meta tags and structured data
- 📊 **Analytics** - Google Analytics 4 integration
- 🎭 **Animations** - Smooth Framer Motion animations
- 🛡️ **Security** - Security headers and best practices
- 🌐 **Multi-language Ready** - Indonesian and English support

## 🛠️ Deployment

This project is configured for **Railway deployment** with optimized performance and security.

### **Railway Deployment Guide**

See [railway.md](./railway.md) for complete deployment instructions.

### **Quick Deploy Commands**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy to Railway
railway up

# View deployment logs
railway logs

# Set environment variables
railway variables set VITE_GA_MEASUREMENT_ID=G-YOUR_GA_ID
```

### **Environment Setup**

Copy environment variables from [ENV_SETUP.md](./ENV_SETUP.md) to Railway dashboard.

## 🛠️ Technologies

### **Frontend Framework**

- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 📘 **TypeScript** - Type-safe development
- ⚡ **Vite** - Fast build tool and dev server

### **Styling & UI**

- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Re-usable UI components (Radix UI)
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🌙 **next-themes** - Dark/light theme support

### **Development Tools**

- 🏗️ **Vite** - Build tool and dev server
- 🔍 **ESLint** - Code linting
- 📏 **TypeScript** - Type checking
- 🎯 **Railway** - Deployment platform

### **SEO & Analytics**

- 🔍 **Complete SEO** - Meta tags, structured data, sitemap
- 📊 **Google Analytics 4** - User behavior tracking
- 🚀 **Performance Monitoring** - Core Web Vitals tracking
- 🤖 **Search Engine Optimization** - Rich snippets, meta descriptions

## 🎨 Development

### **Local Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Production build with optimization
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm run deploy` - Deploy to Railway
