# 🌍 Environment Variables Setup untuk Railway Deployment

## 📋 Environment Variables yang Dibutuhkan

Berikut adalah environment variables yang perlu dikonfigurasi di Railway:

### **Required Variables:**

```bash
# Railway App URL (automatically set by Railway)
VITE_SITE_URL=https://your-app-name.railway.app

# Google Analytics 4 Measurement ID
# Get this from: Google Analytics > Admin > Property > Data Streams > Web
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **Optional Variables:**

```bash
# Social Media Links
RAILWAY_FACEBOOK_URL=https://facebook.com/yourpage
RAILWAY_TWITTER_URL=https://twitter.com/yourhandle
RAILWAY_LINKEDIN_URL=https://linkedin.com/company/yourcompany
RAILWAY_INSTAGRAM_URL=https://instagram.com/yourhandle

# Contact Information
CONTACT_EMAIL=info@yourcompany.com
CONTACT_PHONE=+62-21-12345678
CONTACT_ADDRESS=Your Address, City, Indonesia
```

## 🚀 Setup di Railway Dashboard

### **Langkah 1: Akses Railway Project**

1. Go to [railway.app](https://railway.app)
2. Login dan pilih project **Company-Profile-FTS**
3. Navigate ke **Settings** → **Environment**

### **Langkah 2: Add Environment Variables**

Klik **"New Variable"** dan tambahkan:

#### **Variable 1:**

- **Name**: `VITE_SITE_URL`
- **Value**: `https://your-app-name.railway.app` (Railway will set this automatically)

#### **Variable 2:**

- **Name**: `VITE_GA_MEASUREMENT_ID`
- **Value**: `G-YOUR_ACTUAL_GA_ID` (dapatkan dari Google Analytics)

### **Langkah 3: Redeploy**

Setelah menambahkan environment variables:

1. Go to **Deployments** tab
2. Klik **"Deploy Latest Commit"**
3. Atau push new commit ke GitHub untuk trigger auto-deploy

## 🔧 Setup Google Analytics

### **Langkah 1: Create Google Analytics Account**

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new account atau gunakan existing account
3. Create new **Property** untuk website

### **Langkah 2: Get Measurement ID**

1. Di Google Analytics, go to **Admin**
2. Select your Property
3. Go to **Data Streams** → **Web**
4. Create new Web stream atau gunakan existing
5. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

### **Langkah 3: Update Railway Environment**

1. Go to Railway Dashboard → Environment
2. Update `VITE_GA_MEASUREMENT_ID` dengan actual ID
3. Redeploy aplikasi

## 📊 Monitoring Environment Variables

### **Check Current Variables:**

```bash
# Via Railway CLI
railway run env

# Via Railway Dashboard
Settings → Environment
```

### **Debug Environment Variables:**

```javascript
// Add this temporarily to check if env vars are loaded
console.log('Site URL:', import.meta.env.VITE_SITE_URL);
console.log('GA ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
```

## ⚠️ Common Issues & Solutions

### **Issue 1: Environment Variables Not Loading**

**Solution**:

- Pastikan variable name menggunakan prefix `VITE_` untuk Vite
- Railway case-sensitive untuk variable names
- Redeploy setelah menambahkan variables

### **Issue 2: Google Analytics Not Working**

**Solution**:

- Verify Measurement ID format (`G-XXXXXXXXXX`)
- Check if domain matches in GA settings
- Ensure VITE_GA_MEASUREMENT_ID is correctly set

### **Issue 3: Site URL Issues**

**Solution**:

- Use Railway provided URL: `https://your-app-name.railway.app`
- For custom domain, update both Railway dan environment variable

## 🔄 Update Environment Variables

### **Via Railway Dashboard:**

1. Go to **Settings** → **Environment**
2. Edit existing variable atau add new
3. Redeploy aplikasi

### **Via Railway CLI:**

```bash
# Set environment variable
railway variables set VITE_GA_MEASUREMENT_ID=G-YOUR_NEW_ID

# List all variables
railway variables

# Remove variable
railway variables delete VARIABLE_NAME
```

## 📝 Environment Variables Template

```bash
# Production Environment Variables for Railway
VITE_SITE_URL=https://your-app-name.railway.app
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
PORT=3000

# Optional - Social Media
RAILWAY_FACEBOOK_URL=https://facebook.com/yourpage
RAILWAY_TWITTER_URL=https://twitter.com/yourhandle
RAILWAY_LINKEDIN_URL=https://linkedin.com/company/yourcompany
RAILWAY_INSTAGRAM_URL=https://instagram.com/yourhandle

# Optional - Contact Info
CONTACT_EMAIL=info@yourcompany.com
CONTACT_PHONE=+62-21-12345678
CONTACT_ADDRESS=Your Address, City, Indonesia
```

---

## ✅ Setup Complete Checklist

- [ ] ✅ Railway project created
- [ ] ✅ Environment variables added
- [ ] ✅ Google Analytics account setup
- [ ] ✅ Measurement ID obtained
- [ ] ✅ Variables updated in Railway
- [ ] ✅ Application redeployed
- [ ] ✅ Website tested and working

**Setelah mengikuti panduan ini, Fujiyama Technology Solutions akan live di Railway dengan environment variables yang dikonfigurasi dengan benar!** 🎉
