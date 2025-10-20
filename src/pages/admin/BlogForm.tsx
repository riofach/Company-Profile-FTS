// Admin Blog Form - Create/Edit blog posts dengan real API integration
// Menggunakan blogAdminService, categoryService, dan uploadApi untuk handle blog data

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Save,
	X,
	Plus,
	Tag,
	FileText,
	Upload,
	Eye,
} from 'lucide-react';
import { blogAdminService, categoryService, tagService, BlogResponse } from '@/services/blogService';
import { uploadApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '@/components/ui/RichTextEditor';

// Interface untuk Category
interface Category {
	id: string;
	name: string;
}

// Component BlogForm untuk create/edit blog posts
const BlogForm = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// State untuk form data
	const [formData, setFormData] = useState({
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		categoryId: '',
		tags: [] as string[],
		featuredImage: '',
		isPublished: false,
	});

	// State untuk UI
	const [newTag, setNewTag] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [categories, setCategories] = useState<Category[]>([]);

	// Load categories dari API
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const categoriesData = await categoryService.getAll();
				setCategories(categoriesData);
			} catch (error) {
				console.error('Failed to load categories:', error);
				toast({
					title: 'Error',
					description: 'Failed to load categories',
					variant: 'destructive',
				});
			}
		};
		loadCategories();
	}, []);

	// Load blog data jika edit mode
	useEffect(() => {
		if (id) {
			loadBlogData(id);
		}
	}, [id]);

	// ✅ Function untuk load blog data (edit mode)
	// Fetches specific blog by ID dari admin endpoint (includes drafts)
	const loadBlogData = async (blogId: string) => {
		setIsLoadingData(true);

		try {
			// ✅ Fetch dengan limit 100 untuk ensure blog is included (not just 1 random)
			// Better than 1: guarantees kita dapat blog yang diminta
			const blogData: BlogResponse = await blogAdminService.getAllAdmin({ limit: 100 }).then((res) => {
				// ✅ Cari blog dengan exact ID match
				const blog = res.blogs.find((b) => b.id === blogId);
				if (!blog) throw new Error('Blog not found');
				return blog;
			});

			// Populate form dengan data blog
			setFormData({
				title: blogData.title,
				slug: blogData.slug,
				excerpt: blogData.excerpt,
				content: blogData.content,
				categoryId: blogData.category.id,
				tags: blogData.tags.map((t) => t.name),
				featuredImage: blogData.featuredImage || '',
				isPublished: blogData.isPublished,
			});

			// Set image preview jika ada featured image
			if (blogData.featuredImage) {
				setImagePreview(blogData.featuredImage);
			}
		} catch (error) {
			console.error('Failed to load blog:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to load blog data',
				variant: 'destructive',
			});
			navigate('/admin/blogs');
		} finally {
			setIsLoadingData(false);
		}
	};

	// Generate slug from title
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	};

	// Handle title change and auto-generate slug (only for new blog)
	const handleTitleChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			title: value,
			// Only auto-generate slug jika bukan edit mode
			slug: !id ? generateSlug(value) : prev.slug,
		}));
	};

	// Handle add tag
	const handleAddTag = async () => {
		const trimmedTag = newTag.trim();

		if (!trimmedTag) {
			toast({
				title: 'Invalid Tag',
				description: 'Please enter a tag name',
				variant: 'destructive',
			});
			return;
		}

		if (formData.tags.includes(trimmedTag)) {
			toast({
				title: 'Duplicate Tag',
				description: 'This tag already exists',
				variant: 'destructive',
			});
			return;
		}

		if (formData.tags.length >= 10) {
			toast({
				title: 'Tag Limit Reached',
				description: 'Maximum 10 tags allowed',
				variant: 'destructive',
			});
			return;
		}

		// Add tag to form data
		setFormData((prev) => ({
			...prev,
			tags: [...prev.tags, trimmedTag],
		}));
		setNewTag('');

		// Create tag di backend (jika belum ada, backend akan handle)
		try {
			await tagService.create(trimmedTag);
		} catch (error) {
			// Ignore error, tag mungkin sudah ada
			console.log('Tag creation note:', error);
		}
	};

	// Handle remove tag
	const handleRemoveTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	// Handle file upload
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: 'File too large',
				description: 'Please select an image smaller than 5MB.',
				variant: 'destructive',
			});
			return;
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast({
				title: 'Invalid file type',
				description: 'Please select an image file.',
				variant: 'destructive',
			});
			return;
		}

		setUploadedImage(file);

		// Create preview URL
		const previewUrl = URL.createObjectURL(file);
		setImagePreview(previewUrl);
	};

	// Handle remove uploaded image
	const handleRemoveImage = () => {
		setUploadedImage(null);
		setImagePreview('');
		setFormData((prev) => ({ ...prev, featuredImage: '' }));
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// Validate form data
	const validateForm = (): boolean => {
		// Title validation
		if (formData.title.length < 10 || formData.title.length > 200) {
			toast({
				title: 'Invalid Title',
				description: 'Title must be between 10 and 200 characters',
				variant: 'destructive',
			});
			return false;
		}

		// Slug validation
		if (formData.slug.length < 5 || formData.slug.length > 250) {
			toast({
				title: 'Invalid Slug',
				description: 'Slug must be between 5 and 250 characters',
				variant: 'destructive',
			});
			return false;
		}

		// Excerpt validation
		if (formData.excerpt.length < 50 || formData.excerpt.length > 500) {
			toast({
				title: 'Invalid Excerpt',
				description: 'Excerpt must be between 50 and 500 characters',
				variant: 'destructive',
			});
			return false;
		}

		// Content validation
		const textContent = formData.content.replace(/<[^>]*>/g, '');
		if (textContent.length < 100) {
			toast({
				title: 'Invalid Content',
				description: 'Content must be at least 100 characters',
				variant: 'destructive',
			});
			return false;
		}

		// Category validation
		if (!formData.categoryId) {
			toast({
				title: 'Category Required',
				description: 'Please select a category',
				variant: 'destructive',
			});
			return false;
		}

		return true;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			let imageUrl = formData.featuredImage;

			// Upload image jika ada file yang di-upload
			if (uploadedImage) {
				try {
					const uploadResponse = await uploadApi.uploadSingle(uploadedImage);
					if (uploadResponse.success && uploadResponse.data) {
						imageUrl = uploadResponse.data.url;
					}
				} catch (uploadError) {
					console.error('Image upload failed:', uploadError);
					toast({
						title: 'Upload Failed',
						description: 'Failed to upload image. Blog will be saved without image.',
						variant: 'destructive',
					});
				}
			}

			// Prepare blog data untuk API
			// Note: Set publishedAt to current date/time saat create (backend may override if needed)
			const blogData = {
				title: formData.title,
				excerpt: formData.excerpt,
				content: formData.content,
				categoryId: formData.categoryId,
				tags: formData.tags,
				featuredImage: imageUrl,
				isPublished: formData.isPublished,
				...(formData.isPublished && !id && { publishedAt: new Date().toISOString() }), // Set publish date hanya untuk new blog yang di-publish
			};

			// Create or update blog
			if (id) {
				// Update existing blog
				await blogAdminService.update(id, blogData);
				toast({
					title: 'Blog Updated',
					description: 'Blog post has been updated successfully.',
				});
			} else {
				// Create new blog
				await blogAdminService.create(blogData);
				toast({
					title: 'Blog Created',
					description: 'Blog post has been created successfully.',
				});
			}

			// Navigate back to blogs list
			navigate('/admin/blogs');
		} catch (error) {
			console.error('Error saving blog:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to save blog post',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle cancel
	const handleCancel = () => {
		navigate('/admin/blogs');
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	};

	// Loading state untuk edit mode
	if (isLoadingData) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading blog data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-bold mb-2">
					{id ? 'Edit Blog Post' : 'Create New Blog Post'}
				</h1>
				<p className="text-muted-foreground">
					{id
						? 'Update your blog post content and settings'
						: 'Create a new blog post for your website'}
				</p>
			</motion.div>

			{/* Form */}
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				<Card className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Basic Information
							</h3>

							{/* Helper text untuk mengingatkan requirements minimum 100 character untuk excerpt dan content */}
							<div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-2">
								<p className="text-sm text-blue-800 dark:text-blue-100">
									<span className="font-semibold">📋 Requirements:</span> Excerpt dan Content masing-masing minimum <span className="font-bold">100 characters</span> untuk hasil SEO yang optimal.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => handleTitleChange(e.target.value)}
										placeholder="Enter blog title (10-200 characters)"
										required
										minLength={10}
										maxLength={200}
									/>
									<p className="text-xs text-muted-foreground">
										{formData.title.length}/200 characters
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="slug">Slug *</Label>
									<Input
										id="slug"
										value={formData.slug}
										onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
										placeholder="blog-post-slug"
										required
										minLength={5}
										maxLength={250}
									/>
									<p className="text-xs text-muted-foreground">
										URL-friendly version of the title
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="excerpt">Excerpt * (Minimum 100 characters required)</Label>
								<Textarea
									id="excerpt"
									value={formData.excerpt}
									onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
									placeholder="Brief description of the blog post (minimum 100 characters for better SEO)"
									rows={3}
									required
									minLength={100}
									maxLength={500}
									className={formData.excerpt.length < 100 && formData.excerpt.length > 0 ? 'border-yellow-500 focus:ring-yellow-500' : ''}
								/>
								{/* Character counter with visual feedback: show current vs minimum requirement */}
								<div className="flex justify-between items-center">
									<p className={`text-xs ${formData.excerpt.length < 100 && formData.excerpt.length > 0 ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}`}>
										{formData.excerpt.length}/500 characters
										{formData.excerpt.length < 100 && formData.excerpt.length > 0 && (
											<span className="ml-2 text-yellow-600 font-semibold">
												({100 - formData.excerpt.length} more needed)
											</span>
										)}
									</p>
									{/* Status badge untuk clear visual indication */}
									{formData.excerpt.length >= 100 && (
										<span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">
											✓ Valid
										</span>
									)}
									{formData.excerpt.length > 0 && formData.excerpt.length < 100 && (
										<span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded">
											⚠ Too short
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="content">Content * (Minimum 100 characters required)</Label>
								<RichTextEditor
									value={formData.content}
									onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
									placeholder="Write your blog content here... (minimum 100 characters)"
									minHeight="300px"
								/>
								{/* Character counter untuk Content field dengan visual feedback (HTML tags tidak dihitung) */}
								<div className="flex justify-between items-center flex-wrap gap-2">
									{/* Show character count excluding HTML tags */}
									<p className={`text-xs ${
										formData.content.replace(/<[^>]*>/g, '').length < 100 && formData.content.length > 0 
											? 'text-yellow-600 font-medium' 
											: 'text-muted-foreground'
									}`}>
										{formData.content.replace(/<[^>]*>/g, '').length} characters (HTML not counted)
										{formData.content.replace(/<[^>]*>/g, '').length < 100 && formData.content.length > 0 && (
											<span className="ml-2 text-yellow-600 font-semibold">
												({100 - formData.content.replace(/<[^>]*>/g, '').length} more needed)
											</span>
										)}
									</p>
									{/* Status badge untuk visual indication */}
									{formData.content.replace(/<[^>]*>/g, '').length >= 100 && (
										<span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">
											✓ Valid
										</span>
									)}
									{formData.content.length > 0 && formData.content.replace(/<[^>]*>/g, '').length < 100 && (
										<span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded">
											⚠ Too short
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Use the toolbar above to format your content. HTML tags are not counted in character limit.
								</p>
							</div>
						</motion.div>

						{/* Category and Tags */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Tag className="w-5 h-5" />
								Category & Tags
							</h3>

							<div className="space-y-2">
								<Label htmlFor="category">Category *</Label>
								<Select
									value={formData.categoryId}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Tags (Max 10)</Label>
								<div className="flex flex-wrap gap-2 mb-2">
									{formData.tags.map((tag, index) => (
										<Badge key={index} variant="secondary" className="flex items-center gap-1">
											{tag}
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="ml-1 hover:text-red-500"
											>
												<X className="w-3 h-3" />
											</button>
										</Badge>
									))}
								</div>
								<div className="flex gap-2">
									<Input
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										placeholder="Add new tag"
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
										maxLength={50}
									/>
									<Button type="button" onClick={handleAddTag} size="sm">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									{formData.tags.length}/10 tags - Press Enter or click + to add
								</p>
							</div>
						</motion.div>

						{/* Media and Settings */}
						<motion.div variants={itemVariants} className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Eye className="w-5 h-5" />
								Media & Settings
							</h3>

							<div className="space-y-2">
								<Label htmlFor="featuredImage">Featured Image</Label>
								<div className="space-y-4">
									{/* File Upload */}
									<div className="flex items-center gap-4">
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleFileUpload}
											className="hidden"
											id="imageUpload"
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => fileInputRef.current?.click()}
											className="flex items-center gap-2"
										>
											<Upload className="w-4 h-4" />
											Upload Image
										</Button>
										{imagePreview && (
											<Button
												type="button"
												variant="outline"
												onClick={handleRemoveImage}
												className="text-red-600 hover:text-red-700"
											>
												<X className="w-4 h-4" />
												Remove
											</Button>
										)}
									</div>

									{/* Image Preview */}
									{imagePreview && (
										<div className="relative">
											<img
												src={imagePreview}
												alt="Preview"
												className="w-full max-w-md h-48 object-cover rounded-lg border"
											/>
										</div>
									)}

									{/* Fallback URL Input */}
									<div className="space-y-2">
										<Label htmlFor="featuredImageUrl">Or use image URL</Label>
										<Input
											id="featuredImageUrl"
											type="url"
											value={formData.featuredImage}
											onChange={(e) =>
												setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
											}
											placeholder="https://example.com/image.jpg"
										/>
									</div>

									<p className="text-xs text-muted-foreground">
										Upload an image (max 5MB) or provide an image URL
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="isPublished"
									checked={formData.isPublished}
									onCheckedChange={(checked) =>
										setFormData((prev) => ({ ...prev, isPublished: checked }))
									}
								/>
								<Label htmlFor="isPublished">Publish immediately</Label>
							</div>
						</motion.div>

						{/* Action Buttons */}
						<motion.div variants={itemVariants} className="flex justify-end gap-4 pt-6 border-t">
							<Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
										Saving...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" />
										{id ? 'Update Blog' : 'Create Blog'}
									</>
								)}
							</Button>
						</motion.div>
					</form>
				</Card>
			</motion.div>
		</div>
	);
};

export default BlogForm;
