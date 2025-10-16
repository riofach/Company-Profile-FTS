// Component BlogList untuk menampilkan list semua blogs dengan real API integration
// Menggunakan blogService untuk fetch data dari backend

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import BlogCard from './BlogCard';
import { blogService, BlogResponse, categoryService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

// Interface untuk BlogPost yang compatible dengan BlogCard
interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	author: {
		name: string;
		role: string;
		avatar: string;
	};
	featuredImage: string;
	category: string;
	tags: string[];
	publishedAt: string;
	updatedAt: string;
	readTime: number;
	isPublished: boolean;
	views: number;
}

// Interface untuk BlogList props
interface BlogListProps {
	onBlogClick: (slug: string) => void;
}

// Component BlogList untuk menampilkan list semua blogs dengan real API
const BlogList = ({ onBlogClick }: BlogListProps) => {
	const { toast } = useToast();

	// State untuk blogs data dan loading
	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State untuk pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalBlogs, setTotalBlogs] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [hasPrevPage, setHasPrevPage] = useState(false);
	const blogsPerPage = 12;

	// State untuk search, filter, dan view mode
	const [searchTerm, setSearchTerm] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	// State untuk categories dan tags dari API
	const [categories, setCategories] = useState<string[]>(['all']);
	const [allTags, setAllTags] = useState<string[]>([]);

	// Load categories dari API
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const categoriesData = await categoryService.getAll();
				const categoryNames = categoriesData.map((cat) => cat.name);
				setCategories(['all', ...categoryNames]);
			} catch (error) {
				console.error('Failed to load categories:', error);
			}
		};
		loadCategories();
	}, []);

	// Load blogs dari API dengan pagination dan filter
	useEffect(() => {
		const loadBlogs = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Build query parameters
				const params: Record<string, any> = {
					page: currentPage,
					limit: blogsPerPage,
				};

				if (selectedCategory !== 'all') {
					params.category = selectedCategory;
				}

				if (searchTerm) {
					params.search = searchTerm;
				}

				// Fetch blogs dari API
				const response = await blogService.getAll(params);

				// Convert API response to BlogPost format
				const convertedBlogs: BlogPost[] = response.blogs.map((blog: BlogResponse) => ({
					id: blog.id,
					title: blog.title,
					slug: blog.slug,
					excerpt: blog.excerpt,
					content: blog.content,
					author: {
						name: blog.author.name,
						role: 'Author',
						avatar: './images/admin.webp',
					},
					featuredImage: blog.featuredImage || '/placeholder.svg',
					category: blog.category.name,
					tags: blog.tags.map((tag) => tag.name),
					publishedAt: blog.publishedAt,
					updatedAt: blog.updatedAt,
					readTime: blog.readTime,
					isPublished: blog.isPublished,
					views: blog.views,
				}));

				setBlogs(convertedBlogs);
				setTotalPages(response.pagination.totalPages);
				setTotalBlogs(response.pagination.total);
				setHasNextPage(response.pagination.hasNext);
				setHasPrevPage(response.pagination.hasPrev);

				// Extract unique tags dari response
				const uniqueTags = Array.from(
					new Set(convertedBlogs.flatMap((blog) => blog.tags))
				);
				setAllTags(uniqueTags);
			} catch (error) {
				console.error('Failed to load blogs:', error);
				setError(
					error instanceof Error ? error.message : 'Failed to load blogs'
				);
				toast({
					title: 'Error',
					description: 'Failed to load blog posts. Please try again later.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadBlogs();
	}, [currentPage, searchTerm, selectedCategory]);

	// Handle search submit
	const handleSearch = () => {
		setSearchTerm(searchInput);
		setCurrentPage(1); // Reset to page 1 on new search
	};

	// Handle search on Enter key
	const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Handle category change
	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
		setCurrentPage(1); // Reset to page 1 on filter change
	};

	// Handle tag click untuk search
	const handleTagClick = (tag: string) => {
		setSearchInput(tag);
		setSearchTerm(tag);
		setCurrentPage(1);
	};

	// Handle pagination
	const handleNextPage = () => {
		if (hasNextPage) {
			setCurrentPage((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const handlePrevPage = () => {
		if (hasPrevPage) {
			setCurrentPage((prev) => prev - 1);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	// Clear all filters
	const handleClearFilters = () => {
		setSearchInput('');
		setSearchTerm('');
		setSelectedCategory('all');
		setCurrentPage(1);
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-center mb-12"
			>
				<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
					Our <span className="text-primary">Blog</span>
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
					Insights, trends, and expertise from our team of technology professionals. Stay updated
					with the latest in web development, mobile apps, cloud solutions, and cybersecurity.
				</p>
			</motion.div>

			{/* Search and Filter Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="mb-8"
			>
				<div className="flex flex-col gap-4">
					{/* Search and Filter Row */}
					<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
						{/* Search Input */}
						<div className="relative flex-1 flex gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									type="text"
									placeholder="Search blogs..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyPress={handleSearchKeyPress}
									className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10"
								/>
							</div>
							<Button onClick={handleSearch} className="h-10">
								<Search className="w-4 h-4" />
							</Button>
						</div>

						{/* Category Filter */}
						<Select value={selectedCategory} onValueChange={handleCategoryChange}>
							<SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category === 'all' ? 'All Categories' : category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* View Mode Toggle */}
					<div className="flex gap-2 justify-start">
						<Button
							variant={viewMode === 'grid' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setViewMode('grid')}
							className="p-2 h-10"
						>
							<Grid className="w-4 h-4" />
						</Button>
						<Button
							variant={viewMode === 'list' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setViewMode('list')}
							className="p-2 h-10"
						>
							<List className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Active Filters Display */}
				{(searchTerm || selectedCategory !== 'all') && (
					<div className="flex flex-wrap gap-2 mt-4 items-center">
						{searchTerm && (
							<Badge variant="secondary" className="gap-2">
								Search: "{searchTerm}"
								<button
									onClick={() => {
										setSearchInput('');
										setSearchTerm('');
									}}
									className="ml-1 hover:text-red-500"
								>
									×
								</button>
							</Badge>
						)}
						{selectedCategory !== 'all' && (
							<Badge variant="secondary" className="gap-2">
								Category: {selectedCategory}
								<button
									onClick={() => setSelectedCategory('all')}
									className="ml-1 hover:text-red-500"
								>
									×
								</button>
							</Badge>
						)}
						<Button variant="ghost" size="sm" onClick={handleClearFilters}>
							Clear All
						</Button>
					</div>
				)}
			</motion.div>

			{/* Results Count */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="mb-6"
			>
				<p className="text-gray-600 dark:text-gray-400">
					Showing {blogs.length} of {totalBlogs} blog posts (Page {currentPage} of {totalPages})
				</p>
			</motion.div>

			{/* Loading State */}
			{isLoading ? (
				<div className="text-center py-12">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
				</div>
			) : error ? (
				<div className="text-center py-12">
					<div className="text-red-400 dark:text-red-500 mb-4">
						<Search className="w-16 h-16 mx-auto" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Error loading blogs
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
					<Button variant="outline" onClick={() => window.location.reload()}>
						Retry
					</Button>
				</div>
			) : blogs.length > 0 ? (
				<>
					{/* Blog Grid/List */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className={
							viewMode === 'grid'
								? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
								: 'space-y-6'
						}
					>
						{blogs.map((blog) => (
							<BlogCard key={blog.id} blog={blog} onReadMore={onBlogClick} />
						))}
					</motion.div>

					{/* Pagination */}
					{totalPages > 1 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
							className="mt-12 flex justify-center items-center gap-4"
						>
							<Button
								variant="outline"
								onClick={handlePrevPage}
								disabled={!hasPrevPage}
								className="flex items-center gap-2"
							>
								<ChevronLeft className="w-4 h-4" />
								Previous
							</Button>

							<div className="flex items-center gap-2">
								<span className="text-gray-600 dark:text-gray-400">
									Page {currentPage} of {totalPages}
								</span>
							</div>

							<Button
								variant="outline"
								onClick={handleNextPage}
								disabled={!hasNextPage}
								className="flex items-center gap-2"
							>
								Next
								<ChevronRight className="w-4 h-4" />
							</Button>
						</motion.div>
					)}
				</>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center py-12"
				>
					<div className="text-gray-400 dark:text-gray-500 mb-4">
						<Search className="w-16 h-16 mx-auto" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						No blogs found
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Try adjusting your search terms or filters
					</p>
					<Button variant="outline" onClick={handleClearFilters}>
						Clear Filters
					</Button>
				</motion.div>
			)}

			{/* Popular Tags */}
			{allTags.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="mt-12"
				>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
					<div className="flex flex-wrap gap-2">
						{allTags.slice(0, 10).map((tag, index) => (
							<Badge
								key={index}
								variant="outline"
								className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
								onClick={() => handleTagClick(tag)}
							>
								{tag}
							</Badge>
						))}
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default BlogList;
