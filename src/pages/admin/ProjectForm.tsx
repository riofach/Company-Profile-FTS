import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsApi, uploadApi, type Project } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Komponen ProjectForm untuk add/edit projects
// Menyediakan interface form untuk CRUD operations pada projects
const ProjectForm = () => {
	// Hooks
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const isEditing = Boolean(id);

	// Form state
	const [formData, setFormData] = useState<
		Omit<Project, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
	>({
		title: '',
		description: '',
		tags: [],
		liveUrl: '',
		githubUrl: '',
	});

	const [tagInput, setTagInput] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [isUploading, setIsUploading] = useState(false);

	// Load project data for edit mode
	useEffect(() => {
		if (isEditing && id) {
			loadProject(id);
		}
	}, [isEditing, id, navigate]);

	// Load project data
	const loadProject = async (projectId: string) => {
		setIsLoading(true);
		try {
			const response = await projectsApi.getById(projectId);

			if (response.success && response.data) {
				const project = response.data;
				setFormData({
					title: project.title,
					description: project.description,
					tags: project.tags,
					liveUrl: project.liveUrl || '',
					githubUrl: project.githubUrl || '',
				});

				// Set image preview if imageUrl exists
				if (project.imageUrl) {
					setImagePreview(project.imageUrl);
				}
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Project not found',
					variant: 'destructive',
				});
				navigate('/admin/dashboard');
			}
		} catch (error) {
			console.error('Failed to load project:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
			navigate('/admin/dashboard');
		} finally {
			setIsLoading(false);
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

	// Form validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		let isValid = true;

		if (!formData.title.trim()) {
			newErrors.title = 'Project title is required';
			isValid = false;
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Project description is required';
			isValid = false;
		} else if (formData.description.length < 50) {
			newErrors.description = 'Description must be at least 50 characters';
			isValid = false;
		}

		if (formData.tags.length === 0) {
			newErrors.tags = 'At least one tag is required';
			isValid = false;
		}

		if (!imageFile && !imagePreview && !isEditing) {
			newErrors.image = 'Project image is required';
			isValid = false;
		}

		if (!formData.liveUrl.trim()) {
			newErrors.liveUrl = 'Live URL is required';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);

		try {
			let imageUrl = imagePreview;

			// Upload image if new file is selected
			if (imageFile) {
				setIsUploading(true);
				const uploadResponse = await uploadApi.uploadSingle(imageFile);

				if (uploadResponse.success && uploadResponse.data) {
					imageUrl = uploadResponse.data.url;
				} else {
					toast({
						title: 'Error',
						description: uploadResponse.error || 'Failed to upload image',
						variant: 'destructive',
					});
					setIsUploading(false);
					setIsSubmitting(false);
					return;
				}
				setIsUploading(false);
			}

			// Prepare project data
			const projectData = {
				...formData,
				imageUrl,
			};

			// Create or update project
			let response;
			if (isEditing && id) {
				response = await projectsApi.update(id, projectData);
			} else {
				response = await projectsApi.create(projectData);
			}

			if (response.success) {
				toast({
					title: 'Success',
					description: isEditing ? 'Project updated successfully' : 'Project created successfully',
				});
				navigate('/admin/dashboard');
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to save project',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Form submission failed:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
			setIsUploading(false);
		}
	};

	// Handle input changes
	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	// Handle tag addition
	const handleAddTag = () => {
		const trimmedTag = tagInput.trim();
		if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 5) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, trimmedTag],
			}));
			setTagInput('');
			// Clear tag error if exists
			if (errors.tags) {
				setErrors((prev) => ({ ...prev, tags: '' }));
			}
		}
	};

	// Handle tag removal
	const handleRemoveTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	// Handle tag input key press
	const handleTagKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	};

	// Handle file upload for project image
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setErrors((prev) => ({ ...prev, image: 'Please select a valid image file' }));
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setErrors((prev) => ({ ...prev, image: 'Image size should be less than 5MB' }));
				return;
			}

			setImageFile(file);
			setErrors((prev) => ({ ...prev, image: '' }));

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Handle image removal
	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview('');
		// Clear the file input
		const fileInput = document.getElementById('image-upload') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading project data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-4xl mx-auto"
			>
				{/* Header */}
				<motion.div variants={itemVariants} className="mb-8">
					<h1 className="text-4xl font-bold mb-2">
						{isEditing ? 'Edit Project' : 'Add New Project'}
					</h1>
					<p className="text-muted-foreground">
						{isEditing
							? 'Update your project information and details'
							: 'Fill in the details to add a new project to your portfolio'}
					</p>
				</motion.div>

				{/* Form Card */}
				<motion.div variants={itemVariants}>
					<Card className="p-8">
						{/* Alert for max tags */}
						{formData.tags.length >= 5 && (
							<Alert className="mb-6 bg-yellow-50 border-yellow-200">
								<AlertDescription className="text-yellow-800">
									Maximum 5 tags allowed. Remove existing tags to add new ones.
								</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Project Title */}
							<div className="space-y-2">
								<Label htmlFor="title" className="text-sm font-medium">
									Project Title *
								</Label>
								<Input
									id="title"
									type="text"
									placeholder="Enter project title"
									value={formData.title}
									onChange={(e) => handleInputChange('title', e.target.value)}
									disabled={isSubmitting}
								/>
								{errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
							</div>

							{/* Project Description */}
							<div className="space-y-2">
								<Label htmlFor="description" className="text-sm font-medium">
									Project Description *
								</Label>
								<Textarea
									id="description"
									placeholder="Enter detailed project description (minimum 50 characters)"
									value={formData.description}
									onChange={(e) => handleInputChange('description', e.target.value)}
									rows={4}
									disabled={isSubmitting}
								/>
								{errors.description && (
									<p className="text-xs text-destructive mt-1">{errors.description}</p>
								)}
								<p className="text-xs text-muted-foreground">
									{formData.description.length}/500 characters
								</p>
							</div>

							{/* Project Tags */}
							<div className="space-y-2">
								<Label htmlFor="tags" className="text-sm font-medium">
									Project Tags * (Max 5)
								</Label>
								<div className="flex gap-2">
									<Input
										id="tags"
										type="text"
										placeholder="Enter a tag and press Enter"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyPress={handleTagKeyPress}
										disabled={isSubmitting || formData.tags.length >= 5}
									/>
									<Button
										type="button"
										onClick={handleAddTag}
										disabled={isSubmitting || !tagInput.trim() || formData.tags.length >= 5}
									>
										Add
									</Button>
								</div>
								{errors.tags && <p className="text-xs text-destructive mt-1">{errors.tags}</p>}

								{/* Tags Display */}
								{formData.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-3">
										{formData.tags.map((tag, index) => (
											<div
												key={index}
												className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
											>
												<span>{tag}</span>
												<button
													type="button"
													onClick={() => handleRemoveTag(tag)}
													disabled={isSubmitting}
													className="hover:text-destructive"
												>
													<X className="w-3 h-3" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Project Image Upload */}
							<div className="space-y-2">
								<Label htmlFor="image-upload" className="text-sm font-medium">
									Project Image *
								</Label>
								<div className="space-y-3">
									{/* File Upload Area */}
									<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
										<input
											id="image-upload"
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											disabled={isSubmitting}
											className="hidden"
										/>
										<label
											htmlFor="image-upload"
											className="cursor-pointer flex flex-col items-center space-y-2"
										>
											{imagePreview ? (
												<div className="relative">
													<img
														src={imagePreview}
														alt="Project preview"
														className="w-full h-48 object-cover rounded-lg"
													/>
													<button
														type="button"
														onClick={handleRemoveImage}
														disabled={isSubmitting}
														className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											) : (
												<>
													<Upload className="w-8 h-8 text-muted-foreground" />
													<div className="text-sm text-muted-foreground">
														<p>Click to upload or drag and drop</p>
														<p className="text-xs">PNG, JPG, GIF up to 5MB</p>
													</div>
													<Button
														type="button"
														variant="outline"
														size="sm"
														disabled={isSubmitting}
														className="mt-2"
													>
														<ImageIcon className="w-4 h-4 mr-2" />
														Select Image
													</Button>
												</>
											)}
										</label>
									</div>

									{/* Error Message */}
									{errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}

									{/* Fallback URL Input for existing images */}
									{isEditing && imagePreview && (
										<div className="space-y-2">
											<Label htmlFor="image-url" className="text-xs text-muted-foreground">
												Current image URL:
											</Label>
											<Input
												id="image-url"
												type="text"
												value={imagePreview}
												disabled
												className="text-xs"
											/>
										</div>
									)}
								</div>
							</div>

							{/* Live URL */}
							<div className="space-y-2">
								<Label htmlFor="liveUrl" className="text-sm font-medium">
									Live Demo URL *
								</Label>
								<Input
									id="liveUrl"
									type="url"
									placeholder="https://example.com"
									value={formData.liveUrl}
									onChange={(e) => handleInputChange('liveUrl', e.target.value)}
									disabled={isSubmitting}
								/>
								{errors.liveUrl && (
									<p className="text-xs text-destructive mt-1">{errors.liveUrl}</p>
								)}
							</div>

							{/* GitHub URL */}
							<div className="space-y-2">
								<Label htmlFor="githubUrl" className="text-sm font-medium">
									GitHub URL
								</Label>
								<Input
									id="githubUrl"
									type="url"
									placeholder="https://github.com/username/repo"
									value={formData.githubUrl}
									onChange={(e) => handleInputChange('githubUrl', e.target.value)}
									disabled={isSubmitting}
								/>
							</div>

							{/* Form Actions */}
							<div className="flex gap-4 pt-6">
								<Button
									type="submit"
									className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
									disabled={isSubmitting || isUploading}
								>
									{isSubmitting || isUploading ? (
										<div className="flex items-center space-x-2">
											<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
											<span>
												{isUploading ? 'Uploading...' : isEditing ? 'Updating...' : 'Creating...'}
											</span>
										</div>
									) : (
										<div className="flex items-center space-x-2">
											<Save className="w-4 h-4" />
											<span>{isEditing ? 'Update Project' : 'Create Project'}</span>
										</div>
									)}
								</Button>

								<Button
									type="button"
									variant="outline"
									onClick={() => navigate('/admin/dashboard')}
									disabled={isSubmitting || isUploading}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Card>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default ProjectForm;
