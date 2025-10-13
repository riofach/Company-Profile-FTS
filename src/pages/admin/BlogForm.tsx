import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
	User,
	Calendar,
	Clock,
	Eye,
	FileText,
	Upload,
	Image as ImageIcon,
} from 'lucide-react';
import { BlogPost, mockBlogs, getBlogBySlug } from '@/data/mockBlogs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Interface untuk BlogForm props
interface BlogFormProps {
	blog?: BlogPost | null;
	onSave?: (blog: BlogPost) => void;
	onCancel?: () => void;
}

// Component BlogForm untuk create/edit blog posts
const BlogForm = ({ blog, onSave, onCancel }: BlogFormProps) => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	// State untuk form data
	const [formData, setFormData] = useState({
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		category: '',
		tags: [] as string[],
		featuredImage: '',
		isPublished: false,
		author: {
			name: 'FTS Admin',
			role: 'Administrator',
			avatar: './images/admin.webp',
		},
	});

	// State untuk new tag input
	const [newTag, setNewTag] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load blog data jika edit mode
	useEffect(() => {
		if (id) {
			// Edit mode - load blog by ID
			const existingBlog = mockBlogs.find((b) => b.id === id);
			if (existingBlog) {
				setFormData({
					title: existingBlog.title,
					slug: existingBlog.slug,
					excerpt: existingBlog.excerpt,
					content: existingBlog.content,
					category: existingBlog.category,
					tags: existingBlog.tags,
					featuredImage: existingBlog.featuredImage,
					isPublished: existingBlog.isPublished,
					author: existingBlog.author,
				});
			}
		} else if (blog) {
			// Props mode
			setFormData({
				title: blog.title,
				slug: blog.slug,
				excerpt: blog.excerpt,
				content: blog.content,
				category: blog.category,
				tags: blog.tags,
				featuredImage: blog.featuredImage,
				isPublished: blog.isPublished,
				author: blog.author,
			});
		}
	}, [id, blog]);

	// Generate slug from title
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	};

	// Handle title change and auto-generate slug
	const handleTitleChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			title: value,
			slug: generateSlug(value),
		}));
	};

	// Handle add tag
	const handleAddTag = () => {
		if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, newTag.trim()],
			}));
			setNewTag('');
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
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

		// Validate file type (images only)
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

		// Simulate Cloudinary upload (in real app, upload to Cloudinary)
		toast({
			title: 'Image uploaded',
			description: 'Image will be uploaded to Cloudinary when you save the blog.',
		});
	};

	// Handle remove uploaded image
	const handleRemoveImage = () => {
		setUploadedImage(null);
		setImagePreview('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// ReactQuill configuration
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ indent: '-1' }, { indent: '+1' }],
			[{ align: [] }],
			['link', 'image'],
			['clean'],
		],
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const blogData: BlogPost = {
				id: blog?.id || Date.now().toString(),
				title: formData.title,
				slug: formData.slug,
				excerpt: formData.excerpt,
				content: formData.content,
				category: formData.category,
				tags: formData.tags,
				featuredImage: uploadedImage ? URL.createObjectURL(uploadedImage) : formData.featuredImage,
				isPublished: formData.isPublished,
				readTime: Math.ceil(formData.content.replace(/<[^>]*>/g, '').split(' ').length / 200), // Auto-calculate read time
				author: formData.author,
				publishedAt: blog?.publishedAt || new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				views: blog?.views || 0,
			};

			if (onSave) {
				onSave(blogData);
			}

			toast({
				title: blog ? 'Blog Updated' : 'Blog Created',
				description: `Blog post has been ${blog ? 'updated' : 'created'} successfully.`,
			});

			// Navigate back to blogs list
			navigate('/admin/blogs');
		} catch (error) {
			console.error('Error saving blog:', error);
			toast({
				title: 'Error',
				description: 'Failed to save blog post. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle cancel
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			navigate('/admin/blogs');
		}
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
					{blog ? 'Edit Blog Post' : 'Create New Blog Post'}
				</h1>
				<p className="text-muted-foreground">
					{blog
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

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="title">Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => handleTitleChange(e.target.value)}
										placeholder="Enter blog title"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="slug">Slug *</Label>
									<Input
										id="slug"
										value={formData.slug}
										onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
										placeholder="blog-post-slug"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="excerpt">Excerpt *</Label>
								<Textarea
									id="excerpt"
									value={formData.excerpt}
									onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
									placeholder="Brief description of the blog post (150-300 characters recommended for SEO)"
									rows={3}
									required
								/>
								<p className="text-sm text-muted-foreground">
									Excerpt is a short summary that appears in blog previews and search results. Keep
									it concise and engaging to attract readers.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="content">Content *</Label>
								<div className="border rounded-lg">
									<ReactQuill
										theme="snow"
										value={formData.content}
										onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
										modules={quillModules}
										placeholder="Write your blog content here..."
										style={{ minHeight: '200px' }}
									/>
								</div>
								<p className="text-sm text-muted-foreground">
									Use the toolbar above to format your content with bold, italic, lists, links, and
									more.
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
									value={formData.category}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Technology">Technology</SelectItem>
										<SelectItem value="Security">Security</SelectItem>
										<SelectItem value="Mobile Development">Mobile Development</SelectItem>
										<SelectItem value="Cloud Solutions">Cloud Solutions</SelectItem>
										<SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Tags</Label>
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
									/>
									<Button type="button" onClick={handleAddTag} size="sm">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
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
										{uploadedImage && (
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
											value={formData.featuredImage}
											onChange={(e) =>
												setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
											}
											placeholder="https://example.com/image.jpg"
										/>
									</div>

									<p className="text-sm text-muted-foreground">
										Upload an image (max 5MB) or provide an image URL. Supported formats: JPG, PNG,
										GIF, WebP, SVG.
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
							<Button type="button" variant="outline" onClick={handleCancel}>
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
										{blog ? 'Update Blog' : 'Create Blog'}
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
