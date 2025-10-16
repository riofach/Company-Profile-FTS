// Admin BlogS Management - CRUD operations untuk blog posts dengan real API integration
// Menggunakan blogAdminService untuk fetch dan manage blog data dari backend

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Eye,
	Clock,
	FileText,
	TrendingUp,
} from 'lucide-react';
import { blogAdminService, blogService, categoryService, BlogResponse } from '@/services/blogService';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { formatBlogDate } from '@/utils/dateFormatter';
import { Link, useNavigate } from 'react-router-dom';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Interface untuk BlogPost yang compatible dengan UI
interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	author: {
		name: string;
	};
	featuredImage?: string;
	category: string;
	tags: string[];
	publishedAt: string;
	readTime: number;
	isPublished: boolean;
	views: number;
}

// Component AdminBlogs untuk mengelola blog posts
const AdminBlogs = () => {
	const { toast } = useToast();
	const navigate = useNavigate();

	// State untuk blogs management
	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State untuk search dan filter
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [categories, setCategories] = useState<string[]>(['all']);

	// State untuk delete confirmation
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
	const [isDeletingBlog, setIsDeletingBlog] = useState(false);

	// State untuk stats
	const [stats, setStats] = useState({
		totalBlogs: 0,
		publishedBlogs: 0,
		draftBlogs: 0,
		totalViews: 0,
	});

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

	// Load blogs dari API
	useEffect(() => {
		loadBlogs();
	}, []);

	// Function untuk load blogs dari API
	const loadBlogs = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Fetch all blogs termasuk draft (admin only)
			const response = await blogAdminService.getAllAdmin({
				limit: 100, // Load all blogs untuk admin
			});

			// Convert API response to BlogPost format
			const convertedBlogs: BlogPost[] = response.blogs.map((blog: BlogResponse) => ({
				id: blog.id,
				title: blog.title,
				slug: blog.slug,
				excerpt: blog.excerpt,
				author: {
					name: blog.author.name,
				},
				featuredImage: blog.featuredImage,
				category: blog.category.name,
				tags: blog.tags.map((tag) => tag.name),
				publishedAt: blog.publishedAt,
				readTime: blog.readTime,
				isPublished: blog.isPublished,
				views: blog.views,
			}));

			setBlogs(convertedBlogs);

			// Calculate stats
			const totalBlogs = convertedBlogs.length;
			const publishedBlogs = convertedBlogs.filter((blog) => blog.isPublished).length;
			const draftBlogs = totalBlogs - publishedBlogs;
			const totalViews = convertedBlogs.reduce((sum, blog) => sum + blog.views, 0);

			setStats({
				totalBlogs,
				publishedBlogs,
				draftBlogs,
				totalViews,
			});
		} catch (error) {
			console.error('Failed to load blogs:', error);
			setError(error instanceof Error ? error.message : 'Failed to load blogs');
			toast({
				title: 'Error',
				description: 'Failed to load blog posts. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Filter blogs based on search and filters
	useEffect(() => {
		let filtered = [...blogs];

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(blog) =>
					blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
					blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter((blog) =>
				statusFilter === 'published' ? blog.isPublished : !blog.isPublished
			);
		}

		// Category filter
		if (categoryFilter !== 'all') {
			filtered = filtered.filter(
				(blog) => blog.category.toLowerCase() === categoryFilter.toLowerCase()
			);
		}

		setFilteredBlogs(filtered);
	}, [blogs, searchTerm, statusFilter, categoryFilter]);

	// Handle delete blog click
	const handleDeleteBlogClick = (blog: BlogPost) => {
		setBlogToDelete(blog);
		setDeleteModalOpen(true);
	};

	// Handle close delete modal
	const handleCloseDeleteModal = () => {
		setDeleteModalOpen(false);
		setBlogToDelete(null);
	};

	// Handle confirm delete blog
	const handleConfirmDeleteBlog = async () => {
		if (!blogToDelete) return;

		setIsDeletingBlog(true);

		try {
			// Delete blog via API
			await blogAdminService.delete(blogToDelete.id);

			// Remove blog dari state
			setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete.id));

			toast({
				title: 'Success',
				description: 'Blog post deleted successfully',
			});

			handleCloseDeleteModal();
		} catch (error) {
			console.error('Failed to delete blog:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete blog',
				variant: 'destructive',
			});
		} finally {
			setIsDeletingBlog(false);
		}
	};

	// Handle view blog
	const handleViewBlog = (blog: BlogPost) => {
		navigate(`/blogs/details/${blog.slug}`);
	};

	// Handle edit blog
	const handleEditBlog = (blog: BlogPost) => {
		navigate(`/admin/blogs/edit/${blog.id}`);
	};

	// Handle toggle publish status
	const handleTogglePublish = async (blogId: string) => {
		const blog = blogs.find((b) => b.id === blogId);
		if (!blog) return;

		try {
			// Toggle publish status via API
			await blogAdminService.publish(blogId, !blog.isPublished);

			// Update local state
			setBlogs((prev) =>
				prev.map((b) => (b.id === blogId ? { ...b, isPublished: !b.isPublished } : b))
			);

			toast({
				title: blog.isPublished ? 'Blog Unpublished' : 'Blog Published',
				description: `Blog post has been ${
					blog.isPublished ? 'unpublished' : 'published'
				} successfully.`,
			});
		} catch (error) {
			console.error('Failed to toggle publish status:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to update blog status',
				variant: 'destructive',
			});
		}
	};

	// Get status badge variant
	const getStatusBadge = (isPublished: boolean) => {
		return isPublished ? 'default' : 'secondary';
	};

	// Get status text
	const getStatusText = (isPublished: boolean) => {
		return isPublished ? 'Published' : 'Draft';
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

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-bold mb-2">Blog Management</h1>
				<p className="text-muted-foreground">
					Manage your blog posts and content for FTS - add, edit, or remove blog posts
				</p>
			</motion.div>

			{/* Blog Management Section */}
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				<Card className="p-6">
					{/* Section Header dengan Add Button */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">All Blog Posts</h2>
							<p className="text-muted-foreground">
								{stats.totalBlogs} {stats.totalBlogs === 1 ? 'blog post' : 'blog posts'} in total
							</p>
						</div>
						<Button
							asChild
							className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
						>
							<Link to="/admin/blogs/new" className="flex items-center space-x-2">
								<Plus className="w-4 h-4" />
								<span>Add New Blog</span>
							</Link>
						</Button>
					</div>

					{/* Stats Cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
					>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Blogs</p>
										<p className="text-2xl font-bold">{stats.totalBlogs}</p>
									</div>
									<FileText className="h-8 w-8 text-primary" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Published</p>
										<p className="text-2xl font-bold">{stats.publishedBlogs}</p>
									</div>
									<TrendingUp className="h-8 w-8 text-green-500" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Drafts</p>
										<p className="text-2xl font-bold">{stats.draftBlogs}</p>
									</div>
									<Clock className="h-8 w-8 text-yellow-500" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Views</p>
										<p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
									</div>
									<Eye className="h-8 w-8 text-blue-500" />
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Search Bar */}
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								type="text"
								placeholder="Search blogs by title, excerpt, or author..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Additional Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="published">Published</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
							</SelectContent>
						</Select>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-full sm:w-48">
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

					{/* Blogs List */}
					<div className="space-y-4">
						{isLoading ? (
							<div className="text-center py-12">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<p className="text-muted-foreground">Loading blogs...</p>
							</div>
						) : error ? (
							<div className="text-center py-12">
								<p className="text-red-500 mb-4">{error}</p>
								<Button variant="outline" onClick={loadBlogs}>
									Retry
								</Button>
							</div>
						) : filteredBlogs.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									{searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
										? 'No blogs found matching your search.'
										: 'No blogs yet.'}
								</p>
								{!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
									<Button
										asChild
										className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
									>
										<Link to="/admin/blogs/new" className="flex items-center space-x-2">
											<Plus className="w-4 h-4" />
											<span>Add Your First Blog</span>
										</Link>
									</Button>
								)}
							</div>
						) : (
							filteredBlogs.map((blog) => (
								<motion.div
									key={blog.id}
									variants={itemVariants}
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								>
									<Card className="p-6 hover:shadow-lg transition-all duration-300">
										<div className="flex flex-col lg:flex-row gap-6">
											{/* Blog Image */}
											<div className="lg:w-48 flex-shrink-0">
												<img
													src={blog.featuredImage || '/placeholder.svg'}
													alt={blog.title}
													className="w-full h-32 lg:h-full object-cover rounded-lg"
													onError={(e) => {
														e.currentTarget.src = '/placeholder.svg';
													}}
												/>
											</div>

											{/* Blog Details */}
											<div className="flex-1">
												<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
													<div className="flex-1">
														<div className="flex items-center gap-3 mb-3">
															<Badge variant={getStatusBadge(blog.isPublished)}>
																{getStatusText(blog.isPublished)}
															</Badge>
															<Badge variant="outline">{blog.category}</Badge>
															<span className="text-sm text-muted-foreground">
																{/* Format date dengan validation untuk handle draft blogs */}
															{formatBlogDate(blog)}
															</span>
														</div>

														<h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
														<p className="text-muted-foreground mb-3 line-clamp-2">
															{blog.excerpt}
														</p>

														<div className="flex flex-wrap gap-2 mb-3">
															{blog.tags.slice(0, 3).map((tag, index) => (
																<Badge key={index} variant="secondary" className="text-xs">
																	{tag}
																</Badge>
															))}
															{blog.tags.length > 3 && (
																<Badge variant="secondary" className="text-xs">
																	+{blog.tags.length - 3} more
																</Badge>
															)}
														</div>

														<div className="flex items-center gap-6 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<Clock className="w-4 h-4" />
																<span>{blog.readTime} min read</span>
															</div>
															<div className="flex items-center gap-1">
																<Eye className="w-4 h-4" />
																<span>{blog.views.toLocaleString()} views</span>
															</div>
														</div>
													</div>

													{/* Action Buttons */}
													<div className="flex flex-row sm:flex-col gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleViewBlog(blog)}
															className="flex items-center space-x-2"
														>
															<Eye className="w-4 h-4" />
															<span>View</span>
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleEditBlog(blog)}
															className="flex items-center space-x-2"
														>
															<Edit className="w-4 h-4" />
															<span>Edit</span>
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleTogglePublish(blog.id)}
															className="flex items-center space-x-2"
														>
															{blog.isPublished ? 'Unpublish' : 'Publish'}
														</Button>
														<Button
															variant="destructive"
															size="sm"
															onClick={() => handleDeleteBlogClick(blog)}
															className="flex items-center space-x-2"
														>
															<Trash2 className="w-4 h-4" />
															<span>Delete</span>
														</Button>
													</div>
												</div>
											</div>
										</div>
									</Card>
								</motion.div>
							))
						)}
					</div>
				</Card>
			</motion.div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone
							and will remove all blog data including content and associated information.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteModal} disabled={isDeletingBlog}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDeleteBlog}
							disabled={isDeletingBlog}
							className="bg-destructive hover:bg-destructive/90"
						>
							{isDeletingBlog ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									Deleting...
								</>
							) : (
								'Delete'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AdminBlogs;
