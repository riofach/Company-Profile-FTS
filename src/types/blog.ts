// Blog interfaces untuk FTS Company Profile
// Menyediakan type definitions untuk blog system

// Interface untuk blog author
export interface BlogAuthor {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	bio?: string;
	social?: {
		linkedin?: string;
		twitter?: string;
		github?: string;
	};
}

// Interface untuk blog category
export interface BlogCategory {
	id: string;
	name: string;
	slug: string;
	description?: string;
	color?: string;
}

// Interface untuk blog post
export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featuredImage?: string;
	author: BlogAuthor;
	category: BlogCategory;
	tags: string[];
	status: 'published' | 'draft' | 'archived';
	publishedAt: string;
	updatedAt: string;
	readTime: number; // dalam menit
	views: number;
	likes: number;
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string[];
}

// Interface untuk blog list response
export interface BlogListResponse {
	posts: BlogPost[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Interface untuk blog filter
export interface BlogFilter {
	category?: string;
	author?: string;
	tags?: string[];
	status?: 'published' | 'draft' | 'archived';
	search?: string;
	page?: number;
	limit?: number;
	sortBy?: 'publishedAt' | 'updatedAt' | 'views' | 'likes';
	sortOrder?: 'asc' | 'desc';
}

// Interface untuk blog comment (untuk future use)
export interface BlogComment {
	id: string;
	postId: string;
	authorName: string;
	authorEmail: string;
	content: string;
	status: 'approved' | 'pending' | 'spam';
	createdAt: string;
	updatedAt: string;
	parentId?: string; // untuk nested comments
}
