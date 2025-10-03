// API Service untuk FTS Backend Integration
// Menyediakan fungsi-fungsi untuk komunikasi dengan backend API

// Interface untuk API response
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Interface untuk user data
export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'super_admin';
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string;
	isActive?: boolean;
}

// Interface untuk auth tokens
export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

// Interface untuk login response
export interface LoginResponse {
	user: User;
	tokens: AuthTokens;
}

// Interface untuk project data
export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	imageUrl?: string;
	liveUrl?: string;
	githubUrl?: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

// Interface untuk activity log
export interface ActivityLog {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
	resourceType: 'project' | 'user' | 'system';
	resourceId?: string;
	resourceName?: string;
	details?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
	createdAt: string;
}

// Interface untuk dashboard stats
export interface DashboardStats {
	totalProjects: number;
	totalUsers: number;
	totalTags: number;
	recentProjects: number;
	recentActivity: number;
}

// Base API class
class ApiService {
	private baseURL: string;

	constructor() {
		this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
	}

	// Helper method untuk membuat request
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		try {
			// Get token dari localStorage
			const token = localStorage.getItem('accessToken');

			// Setup default headers
			const headers: HeadersInit = {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				...options.headers,
			};

			// Make request
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...options,
				headers,
			});

			// Handle response
			let data;
			try {
				data = await response.json();
			} catch (error) {
				// If JSON parsing fails, create empty data object
				data = {};
			}

			if (!response.ok) {
				// Handle specific HTTP status codes with user-friendly messages
				let errorMessage = data.error || data.message || `HTTP Error: ${response.status}`;

				// Convert technical error messages to user-friendly ones
				if (response.status === 401) {
					errorMessage = 'Email/Password Wrong';
				} else if (response.status === 403) {
					errorMessage = 'Access denied';
				} else if (response.status === 404) {
					errorMessage = 'Resource not found';
				} else if (response.status === 429) {
					errorMessage = 'Too many attempts. Please try again later.';
				} else if (response.status >= 500) {
					errorMessage = 'Server error. Please try again later.';
				}

				throw new Error(errorMessage);
			}

			// Handle different response formats
			let responseData = data;
			if (data.data !== undefined) {
				responseData = data.data;
			} else if (Array.isArray(data)) {
				// If response is directly an array, use it as is
				responseData = data;
			}

			return {
				success: true,
				data: responseData,
				message: data.message,
			};
		} catch (error) {
			console.error('API Request Error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	// Authentication endpoints
	async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
		return this.request<LoginResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
	}

	async logout(): Promise<ApiResponse> {
		return this.request('/auth/logout', {
			method: 'POST',
		});
	}

	async refreshToken(): Promise<ApiResponse<AuthTokens>> {
		const refreshToken = localStorage.getItem('refreshToken');
		return this.request<AuthTokens>('/auth/refresh', {
			method: 'POST',
			body: JSON.stringify({ refreshToken }),
		});
	}

	async getProfile(): Promise<ApiResponse<User>> {
		return this.request<User>('/auth/profile');
	}

	// Project endpoints
	async getProjects(): Promise<ApiResponse<Project[]>> {
		return this.request<Project[]>('/projects');
	}

	async getProject(id: string): Promise<ApiResponse<Project>> {
		return this.request<Project>(`/projects/${id}`);
	}

	async createProject(
		projectData: Omit<Project, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
	): Promise<ApiResponse<Project>> {
		return this.request<Project>('/projects', {
			method: 'POST',
			body: JSON.stringify(projectData),
		});
	}

	async updateProject(id: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
		return this.request<Project>(`/projects/${id}`, {
			method: 'PUT',
			body: JSON.stringify(projectData),
		});
	}

	async deleteProject(id: string): Promise<ApiResponse> {
		return this.request(`/projects/${id}`, {
			method: 'DELETE',
		});
	}

	// File upload endpoints
	async uploadSingleImage(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
		const formData = new FormData();
		formData.append('image', file);

		const token = localStorage.getItem('accessToken');

		try {
			const response = await fetch(`${this.baseURL}/upload/single`, {
				method: 'POST',
				headers: {
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `HTTP Error: ${response.status}`);
			}

			return {
				success: true,
				data: data.data || data,
				message: data.message,
			};
		} catch (error) {
			console.error('Upload Error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Upload failed',
			};
		}
	}

	async uploadMultipleImages(
		files: File[]
	): Promise<ApiResponse<{ url: string; filename: string }[]>> {
		const formData = new FormData();
		files.forEach((file, index) => {
			formData.append(`images`, file);
		});

		const token = localStorage.getItem('accessToken');

		try {
			const response = await fetch(`${this.baseURL}/upload/multiple`, {
				method: 'POST',
				headers: {
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `HTTP Error: ${response.status}`);
			}

			return {
				success: true,
				data: data.data || data,
				message: data.message,
			};
		} catch (error) {
			console.error('Upload Error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Upload failed',
			};
		}
	}

	// Admin endpoints
	async getUsers(): Promise<ApiResponse<User[]>> {
		return this.request<User[]>('/admin/users');
	}

	async createUser(
		userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }
	): Promise<ApiResponse<User>> {
		return this.request<User>('/admin/users', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	}

	async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
		return this.request<User>(`/admin/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(userData),
		});
	}

	async deleteUser(id: string): Promise<ApiResponse> {
		return this.request(`/admin/users/${id}`, {
			method: 'DELETE',
		});
	}

	async getActivityLogs(): Promise<ApiResponse<ActivityLog[]>> {
		return this.request<ActivityLog[]>('/admin/logs');
	}

	// Note: This endpoint doesn't exist in backend yet, so we'll calculate stats on frontend
	async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
		// Return mock data for now, will be calculated on frontend
		return {
			success: true,
			data: {
				totalProjects: 0,
				totalUsers: 0,
				totalTags: 0,
				recentProjects: 0,
				recentActivity: 0,
			},
		};
	}

	// Helper method to check if user has required role
	private hasRequiredRole(userRole: string, requiredRole: 'admin' | 'super_admin'): boolean {
		if (requiredRole === 'admin') {
			return userRole === 'admin' || userRole === 'super_admin';
		}
		return userRole === 'super_admin';
	}

	// Method to check user permissions
	async checkPermission(requiredRole: 'admin' | 'super_admin'): Promise<boolean> {
		try {
			const token = localStorage.getItem('accessToken');
			if (!token) return false;

			// Get current user data from token or API
			const response = await this.getProfile();
			if (response.success && response.data) {
				return this.hasRequiredRole(response.data.role, requiredRole);
			}
			return false;
		} catch (error) {
			console.error('Permission check failed:', error);
			return false;
		}
	}
}

// Export singleton instance
export const apiService = new ApiService();

// Export specific API methods untuk kemudahan penggunaan
export const authApi = {
	login: (email: string, password: string) => apiService.login(email, password),
	logout: () => apiService.logout(),
	refreshToken: () => apiService.refreshToken(),
	getProfile: () => apiService.getProfile(),
};

export const projectsApi = {
	getAll: () => apiService.getProjects(),
	getById: (id: string) => apiService.getProject(id),
	create: (data: Omit<Project, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) =>
		apiService.createProject(data),
	update: (id: string, data: Partial<Project>) => apiService.updateProject(id, data),
	delete: (id: string) => apiService.deleteProject(id),
};

export const uploadApi = {
	uploadSingle: (file: File) => apiService.uploadSingleImage(file),
	uploadMultiple: (files: File[]) => apiService.uploadMultipleImages(files),
};

export const adminApi = {
	getUsers: () => apiService.getUsers(),
	createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) =>
		apiService.createUser(userData),
	updateUser: (id: string, userData: Partial<User>) => apiService.updateUser(id, userData),
	deleteUser: (id: string) => apiService.deleteUser(id),
	getActivityLogs: () => apiService.getActivityLogs(),
	getDashboardStats: () => apiService.getDashboardStats(),
};
