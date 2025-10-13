import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
	Filter,
	Edit,
	Trash2,
	Eye,
	Calendar,
	User,
	Tag,
	MoreHorizontal,
	FileText,
	TrendingUp,
	Clock,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlogPost, mockBlogs, getPublishedBlogs } from '@/data/mockBlogs';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

// Component AdminBlogs untuk mengelola blog posts
const AdminBlogs = () => {
	const { toast } = useToast();
	const navigate = useNavigate();

	// State untuk blogs management
	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	// State untuk delete confirmation modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
	const [isDeletingBlog, setIsDeletingBlog] = useState(false);

	// Load blogs data
	useEffect(() => {
		loadBlogs();
	}, []);

	// Load blogs from mock data
	const loadBlogs = () => {
		setIsLoading(true);
		try {
			// Simulate API call
			setTimeout(() => {
				setBlogs(mockBlogs);
				setIsLoading(false);
			}, 500);
		} catch (error) {
			console.error('Error loading blogs:', error);
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

	// Get unique categories
	const categories = ['all', ...Array.from(new Set(blogs.map((blog) => blog.category)))];

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
		setIsDeleting(blogToDelete.id);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

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
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsDeletingBlog(false);
			setIsDeleting(null);
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
	const handleTogglePublish = (blogId: string) => {
		setBlogs((prev) =>
			prev.map((blog) => (blog.id === blogId ? { ...blog, isPublished: !blog.isPublished } : blog))
		);

		const blog = blogs.find((b) => b.id === blogId);
		toast({
			title: blog?.isPublished ? 'Blog Unpublished' : 'Blog Published',
			description: `Blog post has been ${
				blog?.isPublished ? 'unpublished' : 'published'
			} successfully.`,
		});
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
								{blogs.length} {blogs.length === 1 ? 'blog post' : 'blog posts'} in total
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
										<p className="text-2xl font-bold">{blogs.length}</p>
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
										<p className="text-2xl font-bold">
											{blogs.filter((blog) => blog.isPublished).length}
										</p>
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
										<p className="text-2xl font-bold">
											{blogs.filter((blog) => !blog.isPublished).length}
										</p>
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
										<p className="text-2xl font-bold">
											{blogs.reduce((sum, blog) => sum + blog.views, 0).toLocaleString()}
										</p>
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
							<input
								type="text"
								placeholder="Search blogs by title, excerpt, or author..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
								<SelectItem value="all">All Categories</SelectItem>
								{categories.slice(1).map((category) => (
									<SelectItem key={category} value={category}>
										{category}
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
						) : filteredBlogs.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									{searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
										? 'No blogs found matching your search.'
										: 'No blogs yet.'}
								</p>
								{!searchTerm && (
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
																{format(new Date(blog.publishedAt), 'MMM dd, yyyy')}
															</span>
														</div>

														<h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
														<p className="text-muted-foreground mb-3 line-clamp-2">
															{blog.excerpt}
														</p>

														<div className="flex flex-wrap gap-2 mb-3">
															{blog.tags.map((tag, index) => (
																<Badge key={index} variant="secondary" className="text-xs">
																	{tag}
																</Badge>
															))}
														</div>

														<div className="flex items-center gap-6 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<User className="w-4 h-4" />
																<span>{blog.author.name}</span>
															</div>
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
															disabled={isDeleting === blog.id}
															className="flex items-center space-x-2"
														>
															{isDeleting === blog.id ? (
																<>
																	<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
																	<span>Deleting...</span>
																</>
															) : (
																<>
																	<Trash2 className="w-4 h-4" />
																	<span>Delete</span>
																</>
															)}
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

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={deleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDeleteBlog}
				title="Delete Blog Post"
				description="Are you sure you want to delete this blog post? This action cannot be undone and will remove all blog data including content and associated information."
				itemName={blogToDelete ? blogToDelete.title : ''}
				isLoading={isDeletingBlog}
			/>
		</div>
	);
};

export default AdminBlogs;
