import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '@/lib/brand';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { projectsApi, type Project } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Komponen Project Management untuk CRUD operations pada projects
// Menyediakan interface untuk mengelola portfolio projects
const ProjectManagement = () => {
	// Hooks
	const { toast } = useToast();

	// State untuk projects
	const [projects, setProjects] = useState<Project[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	// State untuk delete confirmation modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
	const [isDeletingProject, setIsDeletingProject] = useState(false);

	// Load projects on component mount
	useEffect(() => {
		loadProjects();
	}, []);

	// Function untuk load projects dari API
	const loadProjects = async () => {
		setIsLoading(true);
		try {
			const response = await projectsApi.getAll();

			if (response.success && response.data) {
				const projectsArray = Array.isArray(response.data) ? response.data : [];
				setProjects(projectsArray);
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to load projects',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to load projects:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred while loading projects',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Animation variants untuk smooth transitions
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

	// Filter projects berdasarkan search term
	const filteredProjects = Array.isArray(projects)
		? projects.filter(
				(project) =>
					project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
		  )
		: [];

	// Handler untuk membuka delete confirmation modal
	const handleDeleteProjectClick = (project: Project) => {
		setProjectToDelete(project);
		setDeleteModalOpen(true);
	};

	// Handler untuk close delete modal
	const handleCloseDeleteModal = () => {
		setDeleteModalOpen(false);
		setProjectToDelete(null);
	};

	// Handler untuk confirm delete project
	const handleConfirmDeleteProject = async () => {
		if (!projectToDelete) return;

		setIsDeletingProject(true);
		setIsDeleting(projectToDelete.id);

		try {
			const response = await projectsApi.delete(projectToDelete.id);

			if (response.success) {
				// Remove project dari state
				setProjects((prev) => prev.filter((project) => project.id !== projectToDelete.id));
				toast({
					title: 'Success',
					description: 'Project deleted successfully',
				});
				handleCloseDeleteModal();
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to delete project',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to delete project:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsDeletingProject(false);
			setIsDeleting(null);
		}
	};

	// Loading state UI
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading projects...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-bold mb-2">Projects Management</h1>
				<p className="text-muted-foreground">
					Manage your portfolio projects for {COMPANY_NAME} - add, edit, or remove projects
				</p>
			</motion.div>

			{/* Projects Management Section */}
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				<Card className="p-6">
					{/* Section Header dengan Add Button */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">All Projects</h2>
							<p className="text-muted-foreground">
								{projects.length} {projects.length === 1 ? 'project' : 'projects'} in total
							</p>
						</div>
						<Button
							asChild
							className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
						>
							<Link to="/admin/projects/new" className="flex items-center space-x-2">
								<Plus className="w-4 h-4" />
								<span>Add New Project</span>
							</Link>
						</Button>
					</div>

					{/* Search Bar */}
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<input
								type="text"
								placeholder="Search projects by title, description, or tags..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
					</div>

					{/* Projects List */}
					<div className="space-y-4">
						{filteredProjects.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									{searchTerm ? 'No projects found matching your search.' : 'No projects yet.'}
								</p>
								{!searchTerm && (
									<Button
										asChild
										className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
									>
										<Link to="/admin/projects/new" className="flex items-center space-x-2">
											<Plus className="w-4 h-4" />
											<span>Add Your First Project</span>
										</Link>
									</Button>
								)}
							</div>
						) : (
							filteredProjects.map((project) => (
								<motion.div
									key={project.id}
									variants={itemVariants}
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								>
									<Card className="p-6 hover:shadow-lg transition-all duration-300">
										<div className="flex flex-col lg:flex-row gap-6">
											{/* Project Image */}
											<div className="lg:w-48 flex-shrink-0">
												<img
													src={project.imageUrl || '/placeholder.svg'}
													alt={project.title}
													className="w-full h-32 lg:h-full object-cover rounded-lg"
												/>
											</div>

											{/* Project Details */}
											<div className="flex-1">
												<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
													<div className="flex-1">
														<h3 className="text-xl font-semibold mb-2">{project.title}</h3>
														<p className="text-muted-foreground mb-3 line-clamp-2">
															{project.description}
														</p>
														<div className="flex flex-wrap gap-2 mb-3">
															{project.tags.map((tag, index) => (
																<Badge key={index} variant="secondary" className="text-xs">
																	{tag}
																</Badge>
															))}
														</div>
														<p className="text-xs text-muted-foreground">
															Created: {new Date(project.createdAt).toLocaleDateString()} | Updated:{' '}
															{new Date(project.updatedAt).toLocaleDateString()}
														</p>
													</div>

													{/* Action Buttons */}
													<div className="flex flex-row sm:flex-col gap-2">
														<Button
															variant="outline"
															size="sm"
															asChild
															className="flex items-center space-x-2"
														>
															<Link to={`/admin/projects/edit/${project.id}`}>
																<Edit className="w-4 h-4" />
																<span>Edit</span>
															</Link>
														</Button>
														<Button
															variant="destructive"
															size="sm"
															onClick={() => handleDeleteProjectClick(project)}
															disabled={isDeleting === project.id}
															className="flex items-center space-x-2"
														>
															{isDeleting === project.id ? (
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
				onConfirm={handleConfirmDeleteProject}
				title="Delete Project"
				description="Are you sure you want to delete this project? This action cannot be undone and will remove all project data including images and associated information."
				itemName={projectToDelete ? projectToDelete.title : ''}
				isLoading={isDeletingProject}
			/>
		</div>
	);
};

export default ProjectManagement;
