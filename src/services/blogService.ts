// Blog Service untuk FTS Frontend - Blog API Integration
// Menyediakan fungsi-fungsi untuk komunikasi dengan Blog API

// Interface untuk Blog response dari API
// UPDATED: Backend optimizations - content, author.email removed from list responses
export interface BlogResponse {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content?: string;  // Optional - only available in detail view, NOT in list
	featuredImage?: string;
	isPublished: boolean;
	readTime: number;
	views: number;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
	category: {
		id: string;
		name: string;
		slug: string;
		description?: string;
	};
	author: {
		id: string;
		name: string;
		// email removed from list response for privacy/performance
		email?: string;  // Only in detail view
		role?: string;   // Only in detail view
	};
	tags: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
}

// Interface untuk Pagination response
export interface PaginationResponse {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Interface untuk Blog List response
// UPDATED: Backend optimizations - filters removed for performance
export interface BlogListResponse {
	blogs: BlogResponse[];
	pagination: PaginationResponse;
	// filters removed - load separately via categoryService.getAll() and tagService.getAll()
}

// Interface untuk Blog Stats response
export interface BlogStatsResponse {
	totalBlogs: number;
	totalPublished: number;
	totalDrafts: number;
	totalViews: number;
	totalCategories: number;
	totalTags: number;
}

// Interface untuk Category
export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

// Interface untuk Tag
export interface Tag {
	id: string;
	name: string;
	slug: string;
}

// Base API configuration
// ⚠️ SECURITY: Backend URL MUST come from environment variable\n// Never use hardcoded URL as fallback (production security risk)\nconst API_BASE_URL = import.meta.env.VITE_API_BASE_URL;\nif (!API_BASE_URL) {\n\tthrow new Error('VITE_API_BASE_URL environment variable is not configured');\n}

// Helper function untuk membuat API request
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
	const token = localStorage.getItem('accessToken');

	const config: RequestInit = {
		method: options.method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
			...options.headers,
		},
		...options,
	};

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

		// Handle non-JSON responses (seperti 204 No Content)
		if (response.status === 204) {
			return { success: true } as T;
		}

		let data;
		try {
			data = await response.json();
		} catch (error) {
			// Jika response bukan JSON, buat default response
			data = { success: response.ok };
		}

		if (!response.ok) {
			// Handle error response
			const errorMessage = data.error || data.message || `HTTP Error: ${response.status}`;
			throw new Error(errorMessage);
		}

		return data;
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
};

// Blog Service - Public endpoints
export const blogService = {
	/**
	 * Get all published blogs dengan pagination dan filter
	 * @param params - Query parameters (page, limit, category, search, etc)
	 */
	getAll: async (params: Record<string, any> = {}): Promise<BlogListResponse> => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = `/blogs${queryString ? `?${queryString}` : ''}`;
		const response = await apiRequest<{ success: boolean; data: BlogListResponse }>(endpoint);
		return response.data;
	},

	/**
	 * Get single blog by ID or slug
	 * @param idOrSlug - Blog ID or slug
	 */
	getById: async (idOrSlug: string): Promise<BlogResponse> => {
		const response = await apiRequest<{ success: boolean; data: BlogResponse }>(`/blogs/${idOrSlug}`);
		return response.data;
	},

	/**
	 * Search blogs dengan keyword
	 * @param keyword - Search keyword
	 * @param filters - Additional filters (category, tags, etc)
	 */
	search: async (keyword: string, filters: Record<string, any> = {}): Promise<BlogListResponse> => {
		const params = new URLSearchParams({ q: keyword, ...filters }).toString();
		const response = await apiRequest<{ success: boolean; data: BlogListResponse }>(`/blogs/search?${params}`);
		return response.data;
	},

	/**
	 * Get blog statistics
	 */
	getStats: async (): Promise<BlogStatsResponse> => {
		const response = await apiRequest<{ success: boolean; data: BlogStatsResponse }>('/blogs/stats');
		return response.data;
	},

	/**
	 * Get related blogs berdasarkan blog ID
	 * @param blogId - Blog ID
	 * @param limit - Number of related blogs to return
	 */
	getRelated: async (blogId: string, limit: number = 3): Promise<BlogResponse[]> => {
		const response = await apiRequest<{ success: boolean; data: BlogResponse[] }>(`/blogs/${blogId}/related?limit=${limit}`);
		return response.data;
	},

	/**
	 * Track/increment blog view count
	 * Digunakan saat user membaca blog untuk tracking jumlah views
	 * @param blogId - Blog ID yang akan di-track views-nya
	 */
	trackView: async (blogId: string): Promise<void> => {
		// Debug logging untuk troubleshooting
		const endpoint = `/blogs/${blogId}/view`;
		const fullUrl = `${API_BASE_URL}${endpoint}`;
		
		console.log('📊 [VIEW TRACKING] Starting view track...');
		console.log('📊 [VIEW TRACKING] Blog ID:', blogId);
		console.log('📊 [VIEW TRACKING] Full URL:', fullUrl);
		console.log('📊 [VIEW TRACKING] Method: POST');
		
		try {
			const startTime = Date.now();
			await apiRequest<{ success: boolean }>(endpoint, {
				method: 'POST',
			});
			const duration = Date.now() - startTime;
			
			console.log('✅ [VIEW TRACKING] Success!');
			console.log('✅ [VIEW TRACKING] Duration:', duration, 'ms');
		} catch (error) {
			// Silent fail untuk tracking view - tidak perlu interrupt UX
			console.error('❌ [VIEW TRACKING] Failed to track blog view');
			console.error('❌ [VIEW TRACKING] Error:', error);
			console.error('❌ [VIEW TRACKING] Blog ID:', blogId);
		}
	},
};

// Blog Admin Service - Admin endpoints (require authentication)
export const blogAdminService = {
	/**
	 * Get all blogs termasuk draft (admin only)
	 * @param params - Query parameters (page, limit, status, category, etc)
	 */
	getAllAdmin: async (params: Record<string, any> = {}): Promise<BlogListResponse> => {
		const queryString = new URLSearchParams(params).toString();
		const endpoint = `/blogs/admin/all${queryString ? `?${queryString}` : ''}`;
		const response = await apiRequest<{ success: boolean; data: BlogListResponse }>(endpoint);
		return response.data;
	},

	/**
	 * Create new blog
	 * @param data - Blog data
	 */
	create: async (data: {
		title: string;
		excerpt: string;
		content: string;
		categoryId: string;
		tags: string[];
		featuredImage?: string;
		isPublished?: boolean;
	}): Promise<BlogResponse> => {
		const response = await apiRequest<{ success: boolean; data: BlogResponse }>('/blogs', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/**
	 * Update existing blog
	 * @param id - Blog ID
	 * @param data - Updated blog data
	 */
	update: async (id: string, data: Partial<{
		title: string;
		excerpt: string;
		content: string;
		categoryId: string;
		tags: string[];
		featuredImage?: string;
		isPublished?: boolean;
	}>): Promise<BlogResponse> => {
		const response = await apiRequest<{ success: boolean; data: BlogResponse }>(`/blogs/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
		return response.data;
	},

	/**
	 * Delete blog
	 * @param id - Blog ID
	 */
	delete: async (id: string): Promise<void> => {
		await apiRequest<{ success: boolean }>(`/blogs/${id}`, {
			method: 'DELETE',
		});
	},

	/**
	 * Publish or unpublish blog
	 * @param id - Blog ID
	 * @param isPublished - Publish status
	 */
	publish: async (id: string, isPublished: boolean): Promise<BlogResponse> => {
		const response = await apiRequest<{ success: boolean; data: BlogResponse }>(`/blogs/${id}/publish`, {
			method: 'POST',
			body: JSON.stringify({ isPublished }),
		});
		return response.data;
	},
};

// Category Service
export const categoryService = {
	/**
	 * Get all categories
	 */
	getAll: async (): Promise<Category[]> => {
		const response = await apiRequest<{ success: boolean; data: Category[] }>('/categories');
		return response.data;
	},

	/**
	 * Create new category (admin only)
	 * @param data - Category data
	 */
	create: async (data: { name: string; description?: string }): Promise<Category> => {
		const response = await apiRequest<{ success: boolean; data: Category }>('/categories', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		return response.data;
	},
};

// Tag Service
export const tagService = {
	/**
	 * Get all tags
	 */
	getAll: async (): Promise<Tag[]> => {
		const response = await apiRequest<{ success: boolean; data: Tag[] }>('/tags');
		return response.data;
	},

	/**
	 * Create new tag (admin only)
	 * @param name - Tag name
	 */
	create: async (name: string): Promise<Tag> => {
		const response = await apiRequest<{ success: boolean; data: Tag }>('/tags', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
		return response.data;
	},

	/**
	 * Create multiple tags (admin only)
	 * @param names - Array of tag names
	 */
	createBulk: async (names: string[]): Promise<Tag[]> => {
		const response = await apiRequest<{ success: boolean; data: Tag[] }>('/tags/bulk', {
			method: 'POST',
			body: JSON.stringify({ names }),
		});
		return response.data;
	},
};

// Export all services
export default {
	blog: blogService,
	blogAdmin: blogAdminService,
	category: categoryService,
	tag: tagService,
};
