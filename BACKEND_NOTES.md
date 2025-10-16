# 📝 Backend Team Notes - Blog Feature Requirements

## 🚨 Critical Issues Fixed (Frontend)

Frontend telah diupdate untuk fix 2 issues:
1. ✅ Date showing Jan 01, 1970
2. ✅ Views counter not incrementing

**Backend perlu verify endpoints dan auto-handling berikut:**

---

## 📋 Required Backend Endpoints & Behavior

### 1. **POST `/blogs/:id/view` - Track Blog Views**

**Purpose:** Increment blog view counter saat user membaca blog

**Frontend Implementation:**
```javascript
// blogService.ts
trackView: async (blogId: string) => {
  await fetch(`${API_URL}/blogs/${blogId}/view`, { method: 'POST' });
}

// BlogDetail.tsx - Called setiap kali user buka blog
await blogService.trackView(blogData.id);
```

**Backend Requirements:**
- ✅ Endpoint: `POST /blogs/:id/view`
- ✅ No body required (simple increment)
- ✅ Response: `{ success: true }` (atau 204 No Content)
- ✅ Action: Increment `views` field di database
- ⚠️ **Performance:** Use simple `UPDATE blogs SET views = views + 1` (no transaction overhead)
- ⚠️ **No auth required** (public endpoint untuk tracking)

**Example Backend Logic (Simplified):**
```javascript
// POST /blogs/:id/view
router.post('/blogs/:id/view', async (req, res) => {
  const { id } = req.params;
  
  // Simple increment - no complex logic
  await db.query('UPDATE blogs SET views = views + 1 WHERE id = ?', [id]);
  
  res.status(204).send(); // No content response
});
```

**Performance Notes:**
- ✅ Keep it simple - just increment counter
- ✅ No need to store individual view records (unless analytics needed)
- ✅ No need to check IP/session (unless anti-spam needed)
- ⚠️ Consider adding index on `id` column if not exists

---

### 2. **POST `/blogs` - Create Blog with Auto Date**

**Purpose:** Create blog dengan publishedAt yang valid

**Frontend sends:**
```json
{
  "title": "Blog Title",
  "excerpt": "Blog excerpt",
  "content": "Blog content",
  "categoryId": "category-id",
  "tags": ["tag1", "tag2"],
  "featuredImage": "image-url",
  "isPublished": true,
  "publishedAt": "2025-01-16T10:30:00.000Z"  // ← Frontend kirim current date
}
```

**Backend Requirements:**
- ✅ If `isPublished = true` AND `publishedAt` not provided → Set `publishedAt = NOW()`
- ✅ If `isPublished = false` → `publishedAt = NULL`
- ✅ If `publishedAt` provided → Use provided value
- ⚠️ **Validate:** `publishedAt` must not be epoch 0 or null when published

**Example Backend Logic:**
```javascript
// POST /blogs
const createBlog = async (req, res) => {
  let { publishedAt, isPublished, ...blogData } = req.body;
  
  // Auto-set publishedAt jika published tapi tidak ada publishedAt
  if (isPublished && !publishedAt) {
    publishedAt = new Date().toISOString();
  }
  
  const blog = await Blog.create({
    ...blogData,
    isPublished,
    publishedAt: isPublished ? publishedAt : null,
    views: 0, // Initialize views
  });
  
  res.json({ success: true, data: blog });
};
```

---

### 3. **GET `/blogs/:id` - Return Valid Dates**

**Backend Must Ensure:**
- ✅ `publishedAt` never returns `0`, `null`, or invalid timestamp for published blogs
- ✅ If blog is draft, `publishedAt` can be `null`
- ✅ Response format:

```json
{
  "success": true,
  "data": {
    "id": "blog-id",
    "title": "Blog Title",
    "publishedAt": "2025-01-16T10:30:00.000Z",  // ← Valid ISO string
    "views": 42,  // ← Current view count
    ...
  }
}
```

**Validation:**
```javascript
// Ensure valid publishedAt before returning
if (blog.isPublished && !blog.publishedAt) {
  blog.publishedAt = blog.createdAt; // Fallback to createdAt
}
```

---

## 🔧 Database Schema Recommendations

### Table: `blogs`

```sql
CREATE TABLE blogs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category_id VARCHAR(36) NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,  -- ← Simple counter
  published_at TIMESTAMP NULL,  -- ← NULL for drafts
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_views (views),  -- ← For sorting by popular
  INDEX idx_published_at (published_at),  -- ← For sorting by date
  INDEX idx_is_published (is_published)  -- ← For filtering
);
```

**Performance Indexes:**
- ✅ `idx_views` untuk sorting by popularity
- ✅ `idx_published_at` untuk sorting by date
- ✅ `idx_is_published` untuk filter published/draft

---

## 🎯 Frontend Expectations Summary

| Endpoint | Method | Frontend Sends | Backend Returns | Notes |
|----------|--------|----------------|-----------------|-------|
| `/blogs/:id/view` | POST | None | `204 No Content` | Increment views |
| `/blogs` | POST | publishedAt (optional) | Blog with valid publishedAt | Auto-set if missing |
| `/blogs/:id` | GET | None | Blog with valid dates & views | Never return epoch 0 |

---

## ✅ Checklist for Backend Team

### Critical (Must Have):
- [ ] `POST /blogs/:id/view` endpoint exists and increments views
- [ ] `POST /blogs` auto-sets `publishedAt = NOW()` jika published
- [ ] `GET /blogs/:id` never returns invalid timestamps

### Performance (Recommended):
- [ ] Add database index on `views` column
- [ ] Add database index on `published_at` column
- [ ] Keep view tracking simple (no complex analytics)

### Validation (Good to Have):
- [ ] Validate `publishedAt` is not epoch 0
- [ ] Ensure published blogs always have valid `publishedAt`
- [ ] Initialize `views = 0` pada create blog

---

## 🧪 Testing Endpoints

### Test 1: Track Views
```bash
# Should increment views
curl -X POST http://localhost:3000/api/v1/blogs/{blog-id}/view

# Check views increased
curl http://localhost:3000/api/v1/blogs/{blog-id}
# Response should show: "views": 1 (increased)
```

### Test 2: Create Blog without publishedAt
```bash
curl -X POST http://localhost:3000/api/v1/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "excerpt": "Test excerpt with minimum 100 characters...",
    "content": "Test content with minimum 100 characters...",
    "categoryId": "cat-id",
    "tags": ["test"],
    "isPublished": true
    // NO publishedAt field
  }'

# Response should have valid publishedAt (current date)
```

### Test 3: Get Blog
```bash
curl http://localhost:3000/api/v1/blogs/{blog-id}

# Check response:
# - "publishedAt" should NOT be "1970-01-01" 
# - "views" should be a number (not null)
```

---

## 📞 Contact Frontend Team

Jika ada pertanyaan atau perlu adjustment:
- Frontend sudah implement trackView call
- Frontend sudah send publishedAt saat create
- Frontend sudah add fallback untuk invalid dates

**Frontend assumes:**
- Backend akan auto-set publishedAt jika tidak provided
- Backend akan handle view increment efficiently
- Backend akan return valid ISO date strings

---

**Document Version:** 1.0  
**Last Updated:** Jan 16, 2025  
**Frontend Status:** ✅ Implemented & Ready  
**Backend Status:** ⏳ Needs Verification
