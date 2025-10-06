import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen, BarChart3, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '@/lib/brand';
import {
	projectsApi,
	adminApi,
	type Project,
	type DashboardStats,
	type User,
} from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Komponen Admin Dashboard untuk management projects
// Menyediakan interface untuk CRUD operations pada projects
const AdminDashboard = () => {
	// Hooks
	const { toast } = useToast();

	// State
	const [projects, setProjects] = useState<Project[]>([]);
	const [stats, setStats] = useState<DashboardStats>({
		totalProjects: 0,
		totalUsers: 0,
		totalTags: 0,
		recentProjects: 0,
		recentActivity: 0,
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	// Load data on mount
	useEffect(() => {
		loadDashboardData();
	}, []);

	// Load dashboard data
	const loadDashboardData = async () => {
		setIsLoading(true);
		try {
			// Load projects dan users secara paralel untuk performance yang lebih baik
			const [projectsResponse, usersResponse] = await Promise.all([
				projectsApi.getAll(),
				adminApi.getUsers(),
			]);

			// Handle projects data
			let projectsArray: Project[] = [];
			if (projectsResponse.success && projectsResponse.data) {
				projectsArray = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
				setProjects(projectsArray);
			} else {
				toast({
					title: 'Error',
					description: projectsResponse.error || 'Failed to load projects',
					variant: 'destructive',
				});
			}

			// Handle users data
			let usersArray: User[] = [];
			if (usersResponse.success && usersResponse.data) {
				usersArray = Array.isArray(usersResponse.data) ? usersResponse.data : [];
			} else {
				// Log error tapi tidak show toast karena tidak blocking user experience
				console.warn('Failed to load users data:', usersResponse.error);
			}

			// Calculate stats dari projects dan users data
			const calculatedStats: DashboardStats = {
				totalProjects: projectsArray.length,
				totalUsers: usersArray.length, // Fix: Gunakan data dari API users
				totalTags: [...new Set(projectsArray.flatMap((p) => p.tags || []))].length,
				recentProjects: projectsArray.filter((p) => {
					const projectDate = new Date(p.createdAt);
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
					return projectDate > thirtyDaysAgo;
				}).length,
				recentActivity: 0, // Akan diimplementasikan nanti dengan activity logs
			};

			setStats(calculatedStats);
		} catch (error) {
			console.error('Failed to load dashboard data:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred while loading dashboard',
				variant: 'destructive',
			});
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

	// Filter projects based on search term
	const filteredProjects = Array.isArray(projects)
		? projects.filter(
				(project) =>
					project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
		  )
		: [];

	// Handle delete project
	const handleDeleteProject = async (projectId: string) => {
		setIsDeleting(projectId);

		try {
			const response = await projectsApi.delete(projectId);

			if (response.success) {
				setProjects((prev) => prev.filter((project) => project.id !== projectId));
				toast({
					title: 'Success',
					description: 'Project deleted successfully',
				});
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
			setIsDeleting(null);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading dashboard...</p>
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
				<h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
				<p className="text-muted-foreground">Manage your projects and content for {COMPANY_NAME}</p>
			</motion.div>

			{/* Stats Cards */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
			>
				<motion.div variants={itemVariants}>
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Projects</p>
								<p className="text-3xl font-bold">{stats.totalProjects}</p>
							</div>
							<FolderOpen className="h-8 w-8 text-primary" />
						</div>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
								<p className="text-3xl font-bold">{stats.totalUsers}</p>
							</div>
							<Users className="h-8 w-8 text-primary" />
						</div>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Tags</p>
								<p className="text-3xl font-bold">{stats.totalTags}</p>
							</div>
							<BarChart3 className="h-8 w-8 text-primary" />
						</div>
					</Card>
				</motion.div>
			</motion.div>

			{/* Projects Management Section */}
			<motion.div variants={containerVariants} initial="hidden" animate="visible">
				<Card className="p-6">
					{/* Section Header */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<div>
							<h2 className="text-2xl font-bold mb-2">Projects Management</h2>
							<p className="text-muted-foreground">
								Manage your portfolio projects - add, edit, or remove projects
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
						<input
							type="text"
							placeholder="Search projects by title, description, or tags..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
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
															onClick={() => handleDeleteProject(project.id)}
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
		</div>
	);
};

export default AdminDashboard;
