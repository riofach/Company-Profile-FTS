import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Import icons untuk dashboard stats cards
import { FolderOpen, BarChart3, Users, FileText, TrendingUp, Clock, Activity, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '@/lib/brand';
import {
	projectsApi,
	adminApi,
	type Project,
	type DashboardStats,
	type User,
	type ActivityLog,
} from '@/services/api';
// Import blogService untuk fetch blog stats (totalBlogs dan totalViews)
import { blogService, type BlogStatsResponse } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

// Komponen Admin Dashboard untuk overview dan statistik
// Menampilkan informasi penting, grafik, dan recent activity
const AdminDashboard = () => {
	// Hooks
	const { toast } = useToast();

	// State untuk dashboard
	const [stats, setStats] = useState<DashboardStats>({
		totalProjects: 0,
		totalUsers: 0,
		totalTags: 0,
		recentProjects: 0,
		recentActivity: 0,
	});
	// State untuk blog stats (totalBlogs dan totalViews)
	const [blogStats, setBlogStats] = useState<BlogStatsResponse>({
		totalBlogs: 0,
		totalPublished: 0,
		totalDrafts: 0,
		totalViews: 0,
		totalCategories: 0,
		totalTags: 0,
	});
	const [recentProjects, setRecentProjects] = useState<Project[]>([]);
	const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load data on mount
	useEffect(() => {
		loadDashboardData();
	}, []);

	// Load dashboard data (projects, users, dan activity logs)
	const loadDashboardData = async () => {
		setIsLoading(true);
		try {
			// Load data secara paralel untuk performance yang lebih baik
			// Tambahkan blogService.getStats() untuk fetch blog statistics
			const [projectsResponse, usersResponse, activityResponse, blogStatsData] = await Promise.all([
				projectsApi.getAll(),
				adminApi.getUsers(),
				adminApi.getActivityLogs(),
				blogService.getStats(), // Fetch blog stats untuk Total Blogs dan Total Views cards
			]);

			// Handle projects data
			let projectsArray: Project[] = [];
			if (projectsResponse.success && projectsResponse.data) {
				projectsArray = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
				
				// Get recent projects (last 30 days) dan sort by date
				const recent = projectsArray
					.filter((p) => {
						const projectDate = new Date(p.createdAt);
						const thirtyDaysAgo = new Date();
						thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
						return projectDate > thirtyDaysAgo;
					})
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.slice(0, 5); // Ambil 5 project terbaru
				
				setRecentProjects(recent);
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
				console.warn('Failed to load users data:', usersResponse.error);
			}

			// Handle activity logs data
			let activityArray: ActivityLog[] = [];
			if (activityResponse.success && activityResponse.data) {
				activityArray = Array.isArray(activityResponse.data) ? activityResponse.data : [];
				
				// Get recent activity (last 10 activities)
				const recent = activityArray
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.slice(0, 10);
				
				setRecentActivity(recent);
			} else {
				console.warn('Failed to load activity logs:', activityResponse.error);
			}

			// Calculate stats dari data yang sudah di-load
			const calculatedStats: DashboardStats = {
				totalProjects: projectsArray.length,
				totalUsers: usersArray.length,
				totalTags: [...new Set(projectsArray.flatMap((p) => p.tags || []))].length,
				recentProjects: projectsArray.filter((p) => {
					const projectDate = new Date(p.createdAt);
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
					return projectDate > thirtyDaysAgo;
				}).length,
				recentActivity: activityArray.length,
			};

			setStats(calculatedStats);

			// Set blog stats untuk Total Blogs dan Total Views cards
			setBlogStats(blogStatsData);
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

	// Helper function untuk format action text
	const getActionText = (action: string) => {
		const actions: Record<string, string> = {
			CREATE: 'Created',
			UPDATE: 'Updated',
			DELETE: 'Deleted',
			LOGIN: 'Logged in',
			LOGOUT: 'Logged out',
		};
		return actions[action] || action;
	};

	// Helper function untuk format resource type
	const getResourceTypeText = (type: string) => {
		const types: Record<string, string> = {
			project: 'Project',
			user: 'User',
			system: 'System',
		};
		return types[type] || type;
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
				<h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
				<p className="text-muted-foreground">
					Welcome back! Here's what's happening with {COMPANY_NAME}
				</p>
			</motion.div>

			{/* Stats Cards - 4 Column Grid */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
			>
				{/* Total Projects Card */}
				<motion.div variants={itemVariants}>
					<Card className="p-6 hover:shadow-lg transition-all duration-300">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Projects</p>
								<p className="text-3xl font-bold">{stats.totalProjects}</p>
								<p className="text-xs text-muted-foreground mt-1">All time</p>
							</div>
							<FolderOpen className="h-10 w-10 text-primary" />
						</div>
					</Card>
				</motion.div>

				{/* Total Users Card */}
				<motion.div variants={itemVariants}>
					<Card className="p-6 hover:shadow-lg transition-all duration-300">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
								<p className="text-3xl font-bold">{stats.totalUsers}</p>
								<p className="text-xs text-muted-foreground mt-1">Admin users</p>
							</div>
							<Users className="h-10 w-10 text-primary" />
						</div>
					</Card>
				</motion.div>

				{/* Total Blogs Card - Display total blog posts from blog stats */}
				<motion.div variants={itemVariants}>
					<Card className="p-6 hover:shadow-lg transition-all duration-300">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Blogs</p>
								<p className="text-3xl font-bold">{blogStats.totalBlogs}</p>
								<p className="text-xs text-muted-foreground mt-1">{blogStats.totalPublished} published</p>
							</div>
							<FileText className="h-10 w-10 text-primary" />
						</div>
					</Card>
				</motion.div>

				{/* Total Views Card - Display total blog views from blog stats */}
				<motion.div variants={itemVariants}>
					<Card className="p-6 hover:shadow-lg transition-all duration-300">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Views</p>
								<p className="text-3xl font-bold">{blogStats.totalViews.toLocaleString()}</p>
								<p className="text-xs text-muted-foreground mt-1">Blog views</p>
							</div>
							<Eye className="h-10 w-10 text-primary" />
						</div>
					</Card>
				</motion.div>
			</motion.div>

			{/* Two Column Layout: Recent Projects & Activity Logs */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Projects Section */}
				<motion.div variants={containerVariants} initial="hidden" animate="visible">
					<Card className="p-6">
						<div className="flex justify-between items-center mb-6">
							<div>
								<h2 className="text-2xl font-bold flex items-center gap-2">
									<Clock className="w-6 h-6 text-primary" />
									Recent Projects
								</h2>
								<p className="text-sm text-muted-foreground mt-1">Last 5 projects</p>
							</div>
							<Button asChild variant="outline" size="sm">
								<Link to="/admin/projects">View All</Link>
							</Button>
						</div>

						<div className="space-y-4">
							{recentProjects.length === 0 ? (
								<div className="text-center py-8">
									<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
									<p className="text-muted-foreground">No recent projects</p>
								</div>
							) : (
								recentProjects.map((project) => (
									<motion.div
										key={project.id}
										variants={itemVariants}
										className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
									>
										<img
											src={project.imageUrl || '/placeholder.svg'}
											alt={project.title}
											className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
										/>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-sm truncate">{project.title}</h3>
											<p className="text-xs text-muted-foreground line-clamp-1">
												{project.description}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												{new Date(project.createdAt).toLocaleDateString()}
											</p>
										</div>
									</motion.div>
									))
								)}
							</div>
						</Card>
					</motion.div>

					{/* Recent Activity Section */}
					<motion.div variants={containerVariants} initial="hidden" animate="visible">
						<Card className="p-6">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h2 className="text-2xl font-bold flex items-center gap-2">
										<Activity className="w-6 h-6 text-primary" />
										Recent Activity
									</h2>
									<p className="text-sm text-muted-foreground mt-1">Last 10 activities</p>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link to="/admin/activity-logs">View All</Link>
								</Button>
							</div>

							<div className="space-y-3">
								{recentActivity.length === 0 ? (
									<div className="text-center py-8">
										<Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
										<p className="text-muted-foreground">No recent activity</p>
									</div>
								) : (
									recentActivity.map((activity) => (
										<motion.div
											key={activity.id}
											variants={itemVariants}
											className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border-l-2 border-primary"
										>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-sm font-semibold">{activity.userName}</span>
													<span className="text-xs text-muted-foreground">
														{getActionText(activity.action)}
													</span>
												</div>
												<p className="text-xs text-muted-foreground line-clamp-1">
													{getResourceTypeText(activity.resourceType)}
													{activity.resourceName && `: ${activity.resourceName}`}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{new Date(activity.createdAt).toLocaleString()}
												</p>
											</div>
										</motion.div>
									))
								)}
							</div>
						</Card>
					</motion.div>
				</div>
		</div>
	);
};

export default AdminDashboard;
