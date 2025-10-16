# 📱 FTS Frontend Integration Guide - Blog Management System

> **Panduan simple untuk mengintegrasikan Blog API dengan Frontend**

---

## 🚀 Quick Start

### 1. API Configuration

```javascript
// src/config/api.js
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://be-fts-production.up.railway.app/api/v1',
  timeout: 15000,
};

export default API_CONFIG;
```

**Environment Variables (.env)**
```bash
VITE_API_BASE_URL=https://be-fts-production.up.railway.app/api/v1
```

### 2. Default Admin Account
```
Email: admin@fts.biz.id
Password: adminmas123
```

---

## 🎯 API Endpoints Cheat Sheet

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blogs` | List semua published blogs (pagination) |
| GET | `/blogs/:id` | Detail blog by ID/slug |
| GET | `/blogs/search?q=keyword` | Search blogs |
| GET | `/blogs/stats` | Blog statistics |
| GET | `/blogs/:id/related` | Related blogs |
| GET | `/categories` | List semua categories |
| GET | `/tags` | List semua tags |

### Admin Endpoints (Require Auth Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blogs/admin/all` | List ALL blogs (include drafts) |
| POST | `/blogs` | Create new blog |
| PUT | `/blogs/:id` | Update blog |
| DELETE | `/blogs/:id` | Delete blog |
| POST | `/blogs/:id/publish` | Publish/unpublish blog |
| POST | `/categories` | Create category |
| POST | `/tags` | Create tag |
| POST | `/tags/bulk` | Create multiple tags |

---

## 📦 Data Structure

### Blog Response
```javascript
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Blog Title",
    "slug": "blog-title",
    "excerpt": "Short description...",
    "content": "<p>Full content...</p>",
    "featuredImage": "https://cloudinary.com/image.jpg",
    "isPublished": true,
    "readTime": 5,
    "views": 150,
    "publishedAt": "2024-01-01T00:00:00Z",
    "category": {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology"
    },
    "author": {
      "id": "uuid",
      "name": "Admin Name"
    },
    "tags": [
      { "id": "uuid", "name": "JavaScript", "slug": "javascript" }
    ]
  }
}
```

### Pagination Response
```javascript
{
  "blogs": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "categories": [...],
    "tags": [...]
  }
}
```

---

## 💻 Implementation Code

### 1. API Client Setup

```javascript
// src/services/api.js
import API_CONFIG from '../config/api';

// Base fetch wrapper
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### 2. Blog Service

```javascript
// src/services/blogService.js
import { apiClient } from './api';

export const blogService = {
  // Public methods
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/blogs${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiClient(`/blogs/${id}`),
  
  search: (keyword, filters = {}) => {
    const params = new URLSearchParams({ q: keyword, ...filters }).toString();
    return apiClient(`/blogs/search?${params}`);
  },
  
  getStats: () => apiClient('/blogs/stats'),
  
  // Admin methods
  getAllAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/blogs/admin/all${query ? `?${query}` : ''}`);
  },
  
  create: (data) => apiClient('/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiClient(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiClient(`/blogs/${id}`, {
    method: 'DELETE',
  }),
  
  publish: (id, isPublished) => apiClient(`/blogs/${id}/publish`, {
    method: 'POST',
    body: JSON.stringify({ isPublished }),
  }),
};

export const categoryService = {
  getAll: () => apiClient('/categories'),
  create: (data) => apiClient('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const tagService = {
  getAll: () => apiClient('/tags'),
  create: (name) => apiClient('/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  createBulk: (names) => apiClient('/tags/bulk', {
    method: 'POST',
    body: JSON.stringify({ names }),
  }),
};
```

### 3. React Hooks (Optional, tapi recommended)

```javascript
// src/hooks/useBlogs.js
import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';

export const useBlogs = (params = {}) => {
  const [data, setData] = useState({ blogs: [], pagination: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogService.getAll(params);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [JSON.stringify(params)]);

  return { ...data, loading, error, refetch: fetchBlogs };
};

// src/hooks/useBlog.js
export const useBlog = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await blogService.getById(id);
        setBlog(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { blog, loading, error };
};
```

---

## 🎨 Component Examples

### Blog List Page

```javascript
// pages/BlogList.jsx
import { useBlogs } from '../hooks/useBlogs';

export const BlogList = () => {
  const [page, setPage] = useState(1);
  const { blogs, pagination, loading } = useBlogs({ page, limit: 12 });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      <div className="blog-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <img src={blog.featuredImage} alt={blog.title} />
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <span>{blog.readTime} min read</span>
            <a href={`/blogs/${blog.slug}`}>Read More</a>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={!pagination.hasPrev} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {pagination.totalPages}</span>
        <button 
          disabled={!pagination.hasNext} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

### Blog Detail Page

```javascript
// pages/BlogDetail.jsx
import { useParams } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';

export const BlogDetail = () => {
  const { id } = useParams();
  const { blog, loading } = useBlog(id);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <article>
      <img src={blog.featuredImage} alt={blog.title} />
      <h1>{blog.title}</h1>
      <div className="meta">
        <span>By {blog.author.name}</span>
        <span>{blog.readTime} min read</span>
        <span>{blog.views} views</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      
      <div className="tags">
        {blog.tags.map(tag => (
          <span key={tag.id}>{tag.name}</span>
        ))}
      </div>
    </article>
  );
};
```

### Admin Create/Edit Form

```javascript
// pages/admin/BlogForm.jsx
import { useState, useEffect } from 'react';
import { blogService, categoryService, tagService } from '../services/blogService';

export const BlogForm = ({ blogId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [],
    featuredImage: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories
    categoryService.getAll().then(res => setCategories(res.data));
    
    // Load blog if editing
    if (blogId) {
      blogService.getById(blogId).then(res => {
        const blog = res.data;
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          categoryId: blog.category.id,
          tags: blog.tags.map(t => t.name),
          featuredImage: blog.featuredImage,
        });
      });
    }
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (blogId) {
        await blogService.update(blogId, formData);
      } else {
        await blogService.create(formData);
      }
      alert('Blog saved successfully!');
      onSuccess?.();
    } catch (error) {
      alert('Failed to save blog: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Excerpt (50-500 characters)"
        value={formData.excerpt}
        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Content (HTML or markdown)"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        required
      />
      
      <select
        value={formData.categoryId}
        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={formData.tags.join(', ')}
        onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
      />
      
      <input
        type="url"
        placeholder="Featured Image URL"
        value={formData.featuredImage}
        onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : (blogId ? 'Update' : 'Create') + ' Blog'}
      </button>
    </form>
  );
};
```

---

## 🔐 Authentication Integration

```javascript
// src/services/authService.js
export const authService = {
  login: async (email, password) => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Save tokens
    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    
    return response.data.user;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
```

---

## 🎯 Request & Response Examples

### Create Blog Request
```javascript
POST /api/v1/blogs

Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json

Body:
{
  "title": "Getting Started with TypeScript",
  "excerpt": "Learn the basics of TypeScript in this comprehensive guide...",
  "content": "<h2>Introduction</h2><p>TypeScript is...</p>",
  "categoryId": "uuid-category-id",
  "tags": ["TypeScript", "JavaScript", "Programming"],
  "featuredImage": "https://cloudinary.com/image.jpg"
}

Response (201):
{
  "success": true,
  "data": { /* blog object */ }
}
```

### Get Blogs with Filters
```javascript
GET /api/v1/blogs?page=1&limit=10&category=technology&search=typescript

Response (200):
{
  "success": true,
  "data": {
    "blogs": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "categories": [...],
      "tags": [...]
    }
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format
```javascript
{
  "error": "Error Type",
  "message": "Descriptive error message"
}
```

### Common Error Codes
| Code | Error | Cause |
|------|-------|-------|
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Backend error |

### Error Handling Example
```javascript
try {
  const response = await blogService.create(data);
  // Success
} catch (error) {
  // Handle errors
  if (error.message.includes('Unauthorized')) {
    // Redirect to login
  } else if (error.message.includes('validation')) {
    // Show validation errors
  } else {
    // Show generic error
  }
}
```

---

## 🎨 Validation Rules

| Field | Rules |
|-------|-------|
| **title** | 10-200 characters, required |
| **excerpt** | 50-500 characters, required |
| **content** | min 100 characters, required |
| **categoryId** | Valid UUID, required |
| **tags** | Array of strings, max 10 tags, each max 50 chars |
| **featuredImage** | Valid URL, optional |

---

## 🚀 Integration Checklist

### Phase 1: Setup (30 min)
- [ ] Install dependencies (`npm install`)
- [ ] Setup environment variables (`.env`)
- [ ] Create API client (`src/services/api.js`)
- [ ] Create blog service (`src/services/blogService.js`)
- [ ] Test API connection

### Phase 2: Public Pages (2-3 hours)
- [ ] Blog list page dengan pagination
- [ ] Blog detail page
- [ ] Search functionality
- [ ] Category filter
- [ ] Tag filter

### Phase 3: Admin Pages (3-4 hours)
- [ ] Admin dashboard
- [ ] Blog create form
- [ ] Blog edit form
- [ ] Blog delete confirmation
- [ ] Publish/unpublish toggle
- [ ] Category management
- [ ] Tag management

### Phase 4: Enhancement (1-2 hours)
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Form validation
- [ ] SEO meta tags

---

## 🐛 Troubleshooting

### Problem: CORS Error
**Solution:** Backend sudah configure CORS. Pastikan request dari allowed origins.

### Problem: 401 Unauthorized
**Solution:** Check token di localStorage. Token expired? Login ulang.

### Problem: 400 Bad Request
**Solution:** Check validation rules. Semua required fields sudah diisi?

### Problem: Network Error
**Solution:** Check API_BASE_URL. Backend running? Check Railway status.

---

## 📞 Support

**Backend URL:** https://be-fts-production.up.railway.app  
**Health Check:** https://be-fts-production.up.railway.app/health  
**Admin Login:** admin@fts.biz.id / adminmas123

---

**🎉 Ready to implement! Good luck team frontend!**
