import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen, BarChart3, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '@/lib/brand';

// Interface untuk tipe data project
interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	liveUrl: string;
	githubUrl: string;
	createdAt: string;
	updatedAt: string;
}

// Komponen Admin Dashboard untuk management projects
// Menyediakan interface untuk CRUD operations pada projects
const AdminDashboard = () => {
	const [projects, setProjects] = useState<Project[]>([
		{
			id: '1',
			title: 'Tire Reservation',
			description:
				'Advanced tire reservation and inventory management system with real-time availability tracking and automated booking processes. Features comprehensive tire catalog, customer management, and seamless reservation workflow.',
			tags: ['Laravel', 'PostgreSQL', 'Reservation'],
			image: '/images/projects/tire.png',
			liveUrl: 'https://tires.fts.biz.id',
			githubUrl: '#',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15',
		},
		{
			id: '2',
			title: 'Building Maintenance',
			description:
				'Comprehensive building maintenance management system with work order tracking, preventive maintenance scheduling, and facility management. Includes asset tracking, maintenance history, and automated reporting for building operations.',
			tags: ['Laravel', 'MySQL', 'Building', 'Maintenance'],
			image: '/images/projects/bill-maintenance.png',
			liveUrl: 'https://bill-maintenance.fts.biz.id',
			githubUrl: '#',
			createdAt: '2024-01-20',
			updatedAt: '2024-01-20',
		},
		{
			id: '3',
			title: 'Car Repair Shop',
			description:
				'Complete car repair shop management system with appointment scheduling, service tracking, inventory management, and customer relationship management. Features repair history, billing integration, and workshop workflow optimization.',
			tags: ['Laravel', 'MySQL', 'Car Repair', 'Shop'],
			image: '/images/projects/car-repair.png',
			liveUrl: 'https://car-repair.fts.biz.id',
			githubUrl: '#',
			createdAt: '2024-01-25',
			updatedAt: '2024-01-25',
		},
		{
			id: '4',
			title: 'Ebilahall',
			description:
				'Comprehensive event hall management system with booking management, event scheduling, capacity planning, and facility coordination. Features event calendar, customer management, and automated booking confirmations for hall operations.',
			tags: ['Laravel', 'MySQL', 'Hall', 'Event'],
			image: '/images/projects/ebilahall.png',
			liveUrl: 'https://ebilahall.fts.biz.id',
			githubUrl: '#',
			createdAt: '2024-02-01',
			updatedAt: '2024-02-01',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
	const filteredProjects = projects.filter(
		(project) =>
			project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	// Handle delete project
	const handleDeleteProject = async (projectId: string) => {
		setIsDeleting(projectId);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setProjects((prev) => prev.filter((project) => project.id !== projectId));
		setIsDeleting(null);

		// TODO: Show success toast notification
		console.log('Project deleted successfully');
	};

	// Stats data
	const stats = {
		totalProjects: projects.length,
		totalTags: [...new Set(projects.flatMap((p) => p.tags))].length,
		recentProjects: projects.filter((p) => {
			const projectDate = new Date(p.createdAt);
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			return projectDate > thirtyDaysAgo;
		}).length,
	};

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
								<p className="text-sm font-medium text-muted-foreground">Total Tags</p>
								<p className="text-3xl font-bold">{stats.totalTags}</p>
							</div>
							<BarChart3 className="h-8 w-8 text-primary" />
						</div>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Recent Projects</p>
								<p className="text-3xl font-bold">{stats.recentProjects}</p>
							</div>
							<FileText className="h-8 w-8 text-primary" />
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
													src={project.image}
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
