// Custom React Query hooks untuk Blog data fetching dengan caching optimization
// Menggunakan @tanstack/react-query untuk client-side caching dan performance improvement

import { useQuery } from '@tanstack/react-query';
import { blogService, categoryService, BlogListResponse, Category } from '@/services/blogService';

/**
 * Hook untuk fetch blog list dengan pagination dan filtering
 * Includes automatic caching (5 minutes) dan refetch on window focus
 */
export function useBlogsList(
	page: number,
	filters: {
		search?: string;
		category?: string;
		limit?: number;
	} = {}
) {
	return useQuery({
		queryKey: ['blogs', 'list', page, filters],  // Cache key berdasarkan params
		queryFn: async () => {
			// Build query parameters untuk API call
			const params: Record<string, any> = {
				page,
				limit: filters.limit || 12,
			};

			if (filters.category && filters.category !== 'all') {
				params.category = filters.category;
			}

			if (filters.search) {
				params.search = filters.search;
			}

			return await blogService.getAll(params);
		},
		staleTime: 5 * 60 * 1000,      // Data considered fresh for 5 minutes
		gcTime: 10 * 60 * 1000,         // Keep in cache for 10 minutes (renamed from cacheTime)
		retry: 2,                        // Retry failed requests 2 times
		refetchOnWindowFocus: false,     // Don't refetch on window focus (save API calls)
	});
}

/**
 * Hook untuk fetch categories dengan caching permanent
 * Categories jarang berubah, jadi cache selamanya
 */
export function useCategories() {
	return useQuery({
		queryKey: ['categories'],  // Cache key untuk categories
		queryFn: async () => {
			const categories = await categoryService.getAll();
			return categories;
		},
		staleTime: Infinity,       // Never refetch (categories rarely change)
		gcTime: Infinity,          // Keep in cache forever
		retry: 3,                   // Retry 3 times untuk critical data
	});
}

/**
 * Hook untuk fetch single blog detail
 * Cache 10 minutes untuk detail pages
 */
export function useBlogDetail(slug: string) {
	return useQuery({
		queryKey: ['blogs', 'detail', slug],
		queryFn: async () => {
			return await blogService.getById(slug);
		},
		staleTime: 10 * 60 * 1000,  // Fresh for 10 minutes
		gcTime: 30 * 60 * 1000,     // Keep in cache for 30 minutes
		enabled: !!slug,             // Only fetch if slug exists
	});
}

/**
 * Hook untuk fetch related blogs
 * Cache 15 minutes untuk related blogs
 */
export function useRelatedBlogs(blogId: string, limit: number = 3) {
	return useQuery({
		queryKey: ['blogs', 'related', blogId, limit],
		queryFn: async () => {
			return await blogService.getRelated(blogId, limit);
		},
		staleTime: 15 * 60 * 1000,  // Fresh for 15 minutes
		gcTime: 30 * 60 * 1000,     // Keep in cache for 30 minutes
		enabled: !!blogId,           // Only fetch if blogId exists
	});
}
