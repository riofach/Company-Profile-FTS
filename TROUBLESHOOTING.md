# 🔧 Troubleshooting Guide - FTS Blog System

## ⚠️ Error 401 Unauthorized pada Login

### **Gejala:**
```
POST https://be-fts-production.up.railway.app/api/v1/auth/login 401 (Unauthorized)
API Request Error: Error: Email/Password Wrong
```

### **Penyebab:**

1. **❌ Credentials Salah**
   - Email atau password yang dimasukkan tidak sesuai dengan database
   - Typo pada email atau password

2. **🔐 Default Admin Account**
   - Email: `admin@fts.biz.id`
   - Password: `adminmas123`

### **Solusi:**

#### **Step 1: Verify Backend Status**
```bash
# Check apakah backend running
curl https://be-fts-production.up.railway.app/health

# Expected response: Status 200 OK
```

#### **Step 2: Verify Credentials**
- Pastikan menggunakan email: `admin@fts.biz.id`
- Pastikan menggunakan password: `adminmas123`
- **PENTING**: Tidak ada spasi di awal atau akhir
- Password case-sensitive

#### **Step 3: Check Network**
```bash
# Check CORS dan network
# Buka Chrome DevTools > Network tab
# Lihat response dari login request
```

#### **Step 4: Clear Browser Cache**
```bash
# Clear localStorage
localStorage.clear()

# Clear cookies
# Chrome: Settings > Privacy > Clear browsing data
```

### **Jika Masih Error:**

1. **Verify Environment Variables**
   ```bash
   # Check .env file
   VITE_API_BASE_URL=https://be-fts-production.up.railway.app/api/v1
   ```

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Check Backend Logs**
   - Login ke Railway dashboard
   - Check logs untuk error messages

---

## 📢 Warning: findDOMNode is deprecated (ReactQuill)

### **Gejala:**
```
Warning: findDOMNode is deprecated and will be removed in the next major release.
    at ReactQuill2
```

### **Penjelasan:**

Ini adalah **WARNING**, bukan ERROR. Aplikasi tetap berjalan normal.

**Penyebab:**
- ReactQuill library menggunakan legacy API `findDOMNode`
- React 18 menandai API ini sebagai deprecated
- Ini issue dari library, bukan dari code kita

### **Dampak:**
- ✅ **Tidak ada impact ke functionality**
- ✅ **Aplikasi tetap berjalan normal**
- ✅ **Rich text editor tetap bekerja**
- ⚠️ **Hanya warning di console**

### **Solusi (Optional):**

#### **Option 1: Ignore Warning (Recommended untuk sekarang)**
Warning ini tidak mempengaruhi aplikasi. ReactQuill team akan fix di future release.

#### **Option 2: Suppress Warning**
Tambahkan di `main.tsx`:
```typescript
// Suppress ReactQuill findDOMNode warning (temporary)
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
    return;
  }
  originalError.call(console, ...args);
};
```

#### **Option 3: Upgrade ReactQuill (Future)**
```bash
# Tunggu update dari ReactQuill maintainers
npm update react-quill
```

#### **Option 4: Alternative Editor (Long-term)**
Jika warning mengganggu, consider alternative:
- TipTap Editor (modern, no warnings)
- Slate.js (highly customizable)
- Draft.js (by Meta)

---

## 🔍 Common Issues & Solutions

### **Issue: Blog tidak muncul setelah create**

**Solusi:**
1. Check apakah blog di-publish (toggle `isPublished`)
2. Refresh halaman admin blogs
3. Check network tab untuk API response

### **Issue: Image upload gagal**

**Solusi:**
1. Pastikan file size < 5MB
2. Pastikan format image valid (JPG, PNG, GIF, WebP)
3. Check backend upload API endpoint
4. Verify Cloudinary credentials di backend

### **Issue: Category tidak muncul**

**Solusi:**
1. Pastikan backend sudah seed categories
2. Check API endpoint `/api/v1/categories`
3. Verify authentication token valid

### **Issue: Cannot read properties of undefined**

**Solusi:**
1. Check console untuk detailed error
2. Verify API response structure
3. Check if data is loading properly
4. Add null checks di code

### **Issue: CORS Error**

**Solusi:**
1. Verify backend CORS configuration
2. Check `Access-Control-Allow-Origin` header
3. Ensure frontend URL in backend allowed origins

---

## 🚀 Best Practices

### **Development:**
1. Always check browser console for errors
2. Use Network tab untuk debug API calls
3. Clear cache when switching environments
4. Keep dev server running during development

### **Testing:**
1. Test with valid credentials first
2. Check backend health before testing frontend
3. Verify all environment variables loaded
4. Test in incognito mode to avoid cache issues

### **Deployment:**
1. Ensure all environment variables set in Railway
2. Test API connectivity after deployment
3. Monitor logs for errors
4. Have rollback plan ready

---

## 📞 Need Help?

### **Backend Issues:**
- Check Railway logs: https://railway.app
- Verify database connection
- Check API endpoint responses

### **Frontend Issues:**
- Check browser console
- Verify environment variables
- Clear cache and restart

### **Can't Resolve?**
1. Check backend health endpoint
2. Verify credentials dengan backend admin
3. Review recent code changes
4. Check if dependencies updated

---

## ✅ Health Check Checklist

Sebelum report issue, pastikan:

- [ ] Backend running (health check returns 200)
- [ ] Environment variables loaded correctly
- [ ] Using correct credentials
- [ ] Browser cache cleared
- [ ] No network connectivity issues
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)

---

**Last Updated:** October 15, 2024  
**Version:** 1.0.0
