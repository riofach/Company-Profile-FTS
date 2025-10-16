// Component BlogDetail untuk menampilkan detail blog dengan real API integration
// Menggunakan blogService untuk fetch data dari backend dan tracking views

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Eye, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { blogService, BlogResponse } from '@/services/blogService';
import BlogCard from './BlogCard';
import { formatBlogDateString } from '@/utils/dateFormatter';
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

// Interface untuk BlogDetail props
interface BlogDetailProps {
	blogSlug: string;
	onBack: () => void;
	onRelatedBlogClick: (slug: string) => void;
}

// Component BlogDetail untuk menampilkan detail blog
const BlogDetail = ({ blogSlug, onBack, onRelatedBlogClick }: BlogDetailProps) => {
	const { toast } = useToast();

	// State untuk blog data
	const [blog, setBlog] = useState<BlogPost | null>(null);
	const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State untuk UI interactions
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [viewCount, setViewCount] = useState(0);

	// Load blog data dari API
	useEffect(() => {
		const loadBlogData = async () => {
			if (!blogSlug) return;

			setIsLoading(true);
			setError(null);

			try {
				// Fetch blog detail dari API
				const blogData = await blogService.getById(blogSlug);

				// Convert API response to BlogPost format
				const convertedBlog: BlogPost = {
					id: blogData.id,
					title: blogData.title,
					slug: blogData.slug,
					excerpt: blogData.excerpt,
					content: blogData.content,
					author: {
						name: blogData.author.name,
						role: 'Author',
						avatar: './images/admin.webp',
					},
					featuredImage: blogData.featuredImage || '/placeholder.svg',
					category: blogData.category.name,
					tags: blogData.tags.map((tag) => tag.name),
					publishedAt: blogData.publishedAt,
					updatedAt: blogData.updatedAt,
					readTime: blogData.readTime,
					isPublished: blogData.isPublished,
					views: blogData.views,
				};

				setBlog(convertedBlog);
				setViewCount(blogData.views);

				// Track view untuk analytics - increment blog view count
				await blogService.trackView(blogData.id);

				// Load related blogs
				try {
					const relatedData = await blogService.getRelated(blogData.id, 3);
					const convertedRelated: BlogPost[] = relatedData.map((relatedBlog: BlogResponse) => ({
						id: relatedBlog.id,
						title: relatedBlog.title,
						slug: relatedBlog.slug,
						excerpt: relatedBlog.excerpt,
						content: relatedBlog.content,
						author: {
							name: relatedBlog.author.name,
							role: 'Author',
							avatar: './images/admin.webp',
						},
						featuredImage: relatedBlog.featuredImage || '/placeholder.svg',
						category: relatedBlog.category.name,
						tags: relatedBlog.tags.map((tag) => tag.name),
						publishedAt: relatedBlog.publishedAt,
						updatedAt: relatedBlog.updatedAt,
						readTime: relatedBlog.readTime,
						isPublished: relatedBlog.isPublished,
						views: relatedBlog.views,
					}));
					setRelatedBlogs(convertedRelated);
				} catch (relatedError) {
					console.error('Failed to load related blogs:', relatedError);
					// Don't show error for related blogs, it's not critical
				}
			} catch (error) {
				console.error('Failed to load blog:', error);
				setError(
					error instanceof Error ? error.message : 'Failed to load blog'
				);
				toast({
					title: 'Error',
					description: 'Failed to load blog post. Please try again later.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadBlogData();
	}, [blogSlug]);

	// Check bookmark status dari localStorage
	useEffect(() => {
		if (blog) {
			const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
			setIsBookmarked(bookmarks.includes(blog.id));
		}
	}, [blog]);

	// Handle share functionality
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: blog?.title,
					text: blog?.excerpt,
					url: window.location.href,
				});
			} catch (error) {
				console.log('Error sharing:', error);
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			toast({
				title: 'Link Copied',
				description: 'Blog link copied to clipboard!',
			});
		}
	};

	// Handle bookmark toggle
	const handleBookmark = () => {
		if (!blog) return;

		const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

		if (isBookmarked) {
			// Remove bookmark
			const updatedBookmarks = bookmarks.filter((id: string) => id !== blog.id);
			localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
			setIsBookmarked(false);
			toast({
				title: 'Bookmark Removed',
				description: 'Blog removed from your bookmarks',
			});
		} else {
			// Add bookmark
			bookmarks.push(blog.id);
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			setIsBookmarked(true);
			toast({
				title: 'Bookmarked',
				description: 'Blog added to your bookmarks',
			});
		}
	};

	// Format tanggal menggunakan utility function - handle draft blogs dan invalid dates
	const formattedDate = blog ? formatBlogDateString(blog) : '';

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

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
				<div className="text-center py-12">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">Loading blog...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !blog) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-6"
				>
					<Button
						variant="ghost"
						onClick={onBack}
						className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Blogs
					</Button>
				</motion.div>
				<div className="text-center py-12">
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
						Blog Not Found
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						{error || "The blog post you're looking for doesn't exist or has been removed."}
					</p>
					<Button onClick={onBack} className="bg-primary hover:bg-primary/90">
						Back to Blogs
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
			{/* Back Button */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.4 }}
				className="mb-6"
			>
				<Button
					variant="ghost"
					onClick={onBack}
					className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Blogs
				</Button>
			</motion.div>

			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				{/* Featured Image */}
				<motion.div
					variants={itemVariants}
					className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8"
				>
					<img
						src={blog.featuredImage}
						alt={blog.title}
						className="w-full h-full object-cover"
						onError={(e) => {
							e.currentTarget.src = '/placeholder.svg';
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

					{/* Category Badge */}
					<div className="absolute top-4 left-4">
						<Badge
							variant="secondary"
							className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-sm"
						>
							{blog.category}
						</Badge>
					</div>
				</motion.div>

				{/* Article Header */}
				<motion.div variants={itemVariants} className="mb-8">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
						{blog.title}
					</h1>

					<p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
						{blog.excerpt}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mb-6">
						{blog.tags.map((tag, index) => (
							<Badge
								key={index}
								variant="outline"
								className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
							>
								{tag}
							</Badge>
						))}
					</div>

					{/* Meta Information */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
						{/* Author Info */}
						<div className="flex items-center gap-4">
							<Avatar className="w-12 h-12">
								<AvatarImage src={blog.author.avatar} alt={blog.author.name} />
								<AvatarFallback>
									{blog.author.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold text-gray-900 dark:text-white">{blog.author.name}</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">{blog.author.role}</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleShare}
								className="flex items-center gap-2"
							>
								<Share2 className="w-4 h-4" />
								Share
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleBookmark}
								className={`flex items-center gap-2 ${isBookmarked ? 'bg-primary text-white' : ''}`}
							>
								<Bookmark className="w-4 h-4" />
								{isBookmarked ? 'Saved' : 'Save'}
							</Button>
						</div>
					</div>

					{/* Article Meta */}
					<div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>{formattedDate}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>{blog.readTime} min read</span>
						</div>
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4" />
							<span>{viewCount.toLocaleString()} views</span>
						</div>
					</div>

					<Separator className="mb-8" />
				</motion.div>

				{/* Article Content */}
				<motion.div
					variants={itemVariants}
					className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300"
					dangerouslySetInnerHTML={{ __html: blog.content }}
				/>

				{/* Related Blogs */}
				{relatedBlogs.length > 0 && (
					<motion.div variants={itemVariants} className="mt-12">
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
							Related Articles
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{relatedBlogs.map((relatedBlog) => (
								<BlogCard key={relatedBlog.id} blog={relatedBlog} onReadMore={onRelatedBlogClick} />
							))}
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default BlogDetail;
