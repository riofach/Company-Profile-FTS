# 📝 FTS Frontend Integration Documentation

## 🌐 Overview

Dokumentasi ini menjelaskan integrasi frontend FTS dengan backend API yang sudah dibuat. Frontend telah diintegrasikan dengan backend menggunakan React, TypeScript, dan API service yang terhubung ke backend Railway.

## 🔧 Setup Configuration

### Environment Variables

Frontend menggunakan environment variables untuk konfigurasi API:

```bash
# Development (.env.development)
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Production (.env.production)
VITE_API_BASE_URL=https://be-fts-production.up.railway.app/api/v1
```

### Dependencies

Frontend menggunakan dependencies berikut untuk integrasi:

- `@tanstack/react-query` - State management dan caching
- `axios` - HTTP client (digunakan dalam API service)
- `react-router-dom` - Routing
- `framer-motion` - Animations
- `shadcn/ui` - UI components
- `lucide-react` - Icons

## 🔐 Authentication System

### AuthContext

Frontend menggunakan `AuthContext` untuk mengelola authentication state:

```typescript
// src/context/AuthContext.tsx
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Login, logout, token refresh functions
};
```

### Login Flow

1. User memasukkan email dan password di `/login-admin`
2. Frontend mengirim request ke `POST /api/auth/login`
3. Backend mengembalikan user data dan tokens
4. Tokens disimpan di localStorage
5. User di-redirect ke `/admin/dashboard`

### Token Management

- **Access Token**: Disimpan di localStorage, digunakan untuk API requests
- **Refresh Token**: Disimpan di localStorage, digunakan untuk refresh access token
- **Auto Refresh**: Access token di-refresh setiap 14 menit

## 📡 API Service

### API Service Structure

```typescript
// src/services/api.ts
export const apiService = new ApiService();

// API methods
export const authApi = {
	login: (email, password) => apiService.login(email, password),
	logout: () => apiService.logout(),
	// ...
};

export const projectsApi = {
	getAll: () => apiService.getProjects(),
	getById: (id) => apiService.getProject(id),
	create: (data) => apiService.createProject(data),
	// ...
};
```

### API Endpoints

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

#### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### File Upload

- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

#### Admin

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/logs` - Get activity logs
- `GET /api/admin/stats` - Get dashboard stats

## 🎨 Admin Pages Integration

### Dashboard (`/admin/dashboard`)

- **API Integration**: `projectsApi.getAll()` dan `adminApi.getDashboardStats()`
- **Features**:
  - Display project statistics
  - List all projects dengan search dan filter
  - Delete project functionality
  - Real-time data loading

### Project Form (`/admin/projects/new` dan `/admin/projects/edit/:id`)

- **API Integration**: `projectsApi.create()`, `projectsApi.update()`, `uploadApi.uploadSingle()`
- **Features**:
  - Form validation
  - Image upload dengan preview
  - Tag management
  - Loading states
  - Error handling

### User Management (`/admin/users`)

- **API Integration**: `adminApi.getUsers()`, `adminApi.createUser()`, `adminApi.updateUser()`, `adminApi.deleteUser()`
- **Features**:
  - User CRUD operations
  - Role management
  - User status toggle
  - Search dan filter

### Activity Logs (`/admin/activity-logs`)

- **API Integration**: `adminApi.getActivityLogs()`
- **Features**:
  - Activity history display
  - Advanced filtering
  - CSV export
  - Real-time updates

## 🛡️ Error Handling

### API Error Handling

Frontend menggunakan toast notifications untuk error handling:

```typescript
const { toast } = useToast();

// Example error handling
const response = await projectsApi.getAll();
if (!response.success) {
	toast({
		title: 'Error',
		description: response.error || 'Failed to load projects',
		variant: 'destructive',
	});
}
```

### Loading States

Semua API calls memiliki loading states:

```typescript
const [isLoading, setIsLoading] = useState(false);

// Loading spinner
if (isLoading) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
				<p className="text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
```

## 🔄 Data Flow

### Authentication Flow

1. User login → AuthContext → API Service → Backend
2. Backend response → API Service → AuthContext → State Update
3. Token storage → Auto-refresh → Protected Routes

### Project Management Flow

1. Dashboard → Load Projects → API Service → Backend
2. Create/Edit Project → Form Validation → API Service → Backend
3. File Upload → Cloudinary → URL Storage → Backend
4. Success/Error → Toast Notification → State Update

## 🧪 Testing

### Manual Testing Steps

1. **Authentication Testing**

   - Login dengan default admin: `admin@fts.biz.id` / `adminmas123`
   - Test token refresh (tunggu 14 menit)
   - Test logout functionality

2. **Project Management Testing**

   - Create new project dengan image upload
   - Edit existing project
   - Delete project
   - Test search dan filter

3. **User Management Testing**

   - Create new user
   - Edit user information
   - Toggle user status
   - Delete user

4. **Activity Logs Testing**
   - View activity logs
   - Test filtering
   - Export to CSV

### API Testing

Gunakan tools seperti Postman atau curl untuk testing API endpoints:

```bash
# Test login
curl -X POST https://be-fts-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fts.biz.id", "password": "adminmas123"}'

# Test get projects (dengan token)
curl -X GET https://be-fts-production.up.railway.app/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**

   - Set `VITE_API_BASE_URL` ke production backend URL
   - Ensure backend sudah deployed di Railway

2. **Build Process**

   ```bash
   npm run build
   npm run preview
   ```

3. **Deployment Platforms**
   - Railway: Automatic deployment dari GitHub
   - Vercel/Netlify: Static hosting
   - Custom server: Nginx/Apache

### Environment Configuration

```bash
# Production environment variables
VITE_API_BASE_URL=https://be-fts-production.up.railway.app/api/v1
```

## 📊 Performance Optimization

### API Caching

- React Query untuk caching API responses
- Automatic background refetching
- Stale-while-revalidate strategy

### Image Optimization

- Cloudinary untuk image storage
- Automatic image optimization
- Lazy loading untuk project images

### Bundle Optimization

- Code splitting dengan React.lazy
- Tree shaking untuk unused code
- Minification dengan Terser

## 🔍 Troubleshooting

### Common Issues

1. **CORS Error**

   - Check backend CORS configuration
   - Ensure frontend URL ada di allowed origins

2. **401 Unauthorized**

   - Check token expiration
   - Verify token storage di localStorage

3. **404 Not Found**

   - Check API endpoint URLs
   - Verify backend deployment

4. **Network Error**
   - Check backend server status
   - Verify API base URL configuration

### Debug Tips

```typescript
// Add logging untuk debugging
console.log('API Request:', endpoint, options);
console.log('API Response:', response);

// Check token storage
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

## 📞 Support

### Backend Documentation

Lihat `notes-fe.md` untuk dokumentasi API lengkap.

### Contact

- Backend URL: https://be-fts-production.up.railway.app
- Health Check: https://be-fts-production.up.railway.app/health
- Admin Login: admin@fts.biz.id / adminmas123

---

## 📋 Integration Checklist

- [x] Environment variables configuration
- [x] AuthContext implementation
- [x] API service integration
- [x] Login page integration
- [x] Admin layout authentication check
- [x] Dashboard API integration
- [x] Project form API integration
- [x] User management API integration
- [x] Activity logs API integration
- [x] Error handling implementation
- [x] Loading states implementation
- [x] Toast notifications
- [x] File upload integration
- [x] Token management
- [x] Production deployment ready

---

🎉 **Frontend integration selesai!** Frontend FTS sekarang terintegrasi penuh dengan backend API dan siap untuk production deployment.
