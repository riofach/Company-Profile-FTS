# Backend Verification - Blog Edit Feature

## Status: ✅ VERIFICATION NEEDED (Tidak perlu perubahan, hanya verify)

## Context
Frontend sudah diperbaiki untuk fix issue "content not loading when editing blog". 

## What Changed (Frontend)
- **Before**: Pakai `/blogs/admin/all?limit=100` (list endpoint) - content field tidak included
- **After**: Pakai `/blogs/{id}` (detail endpoint) - content field harus included

## Backend Requirement to Verify

### Endpoint: `GET /blogs/{id}`

**Yang perlu di-verify:**

1. ✅ **Authenticated Admin dapat access draft blogs**
   ```
   GET /blogs/{blogId}
   Headers: Authorization: Bearer <admin-token>
   
   Expected: Return blog data EVEN IF isPublished = false
   ```

2. ✅ **Response include FULL content field**
   ```json
   {
     "success": true,
     "data": {
       "id": "xxx",
       "title": "...",
       "content": "HARUS ADA FIELD INI", // ← Critical!
       "excerpt": "...",
       "category": {...},
       "tags": [...],
       ...
     }
   }
   ```

## Expected Behavior (Sudah Benar?)

| User Type | Blog Status | Should Return? |
|-----------|-------------|----------------|
| Unauthenticated | Published | ✅ Yes |
| Unauthenticated | Draft | ❌ No (404/403) |
| Authenticated Admin | Published | ✅ Yes with full content |
| Authenticated Admin | Draft | ✅ Yes with full content |

## If Current Endpoint Doesn't Support Draft Access

**Option 1: Modify existing endpoint** (Recommended)
```javascript
// Check if user is authenticated admin
if (isAdmin(req.user)) {
  // Return any blog (including drafts)
  return blog;
} else {
  // Only return published blogs
  if (!blog.isPublished) {
    throw new NotFoundError();
  }
  return blog;
}
```

**Option 2: Create new admin endpoint**
```
GET /blogs/admin/{id}
```

## Test Cases
1. ✅ Admin edit published blog → content loads
2. ✅ Admin edit draft blog → content loads
3. ✅ Public view published blog → works
4. ❌ Public view draft blog → 404/403

## Notes
- Frontend sudah assume endpoint `/blogs/{id}` support admin access to drafts
- Jika endpoint ini public-only, maka perlu Option 2 (new admin endpoint)
- Frontend mudah adjust jika perlu pakai endpoint berbeda

---
**Verification Date**: ${new Date().toISOString()}
**Frontend Fix**: src/pages/admin/BlogForm.tsx line 97-104
