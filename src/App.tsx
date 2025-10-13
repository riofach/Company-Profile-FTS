import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import SEO from '@/components/SEO';
import { Analytics, PerformanceMonitor } from '@/components/Analytics';
// Pembungkus global aplikasi: QueryClient, ThemeProvider, Tooltip, Toaster, dan Router.
import Index from './pages/Index';
import Projects from './pages/Projects';
import AllProjects from './pages/AllProjects';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import LoginAdmin from './pages/LoginAdmin';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectForm from './pages/admin/ProjectForm';
import ActivityLogs from './pages/admin/ActivityLogs';
import UserManagement from './pages/admin/UserManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import AdminBlogs from './pages/admin/AdminBlogs';
import BlogForm from './pages/admin/BlogForm';
import AdminLayout from './components/admin/AdminLayout';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="auto" storageKey="fts-theme">
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<Analytics />
					<PerformanceMonitor />
					<BrowserRouter>
						<Routes>
							<Route
								path="/"
								element={
									<>
										<SEO
											title="Home"
											description="Fujiyama Technology Solutions - Japanese-rooted IT company providing innovative digital solutions in Indonesia. Web development, mobile apps, cloud services, and cybersecurity."
											keywords="Fujiyama Technology Solutions, FTS, IT Services Indonesia, Japanese IT Company, Web Development Jakarta, Mobile Apps Indonesia"
										/>
										<Index />
									</>
								}
							/>
							<Route
								path="/projects"
								element={
									<>
										<SEO
											title="Our Projects"
											description="Explore our portfolio of innovative digital solutions. Web design, development, and mobile applications showcasing our expertise in modern technology."
											keywords="FTS Projects, Web Development Portfolio, Mobile Apps Showcase, IT Solutions Indonesia, Technology Portfolio"
											type="website"
										/>
										<Projects />
									</>
								}
							/>
							<Route
								path="/projects/all"
								element={
									<>
										<SEO
											title="All Projects - Complete Portfolio"
											description="Complete showcase of all our technology projects and digital solutions. Web development, mobile apps, and software development portfolio."
											keywords="FTS All Projects, Complete Portfolio, Web Development Showcase, Mobile Apps Portfolio, Software Development Projects"
											type="website"
										/>
										<AllProjects />
									</>
								}
							/>
							<Route
								path="/projects/:category"
								element={
									<>
										<SEO
											title="Project Portfolio"
											description="Detailed showcase of our technology projects and digital solutions across various industries and platforms."
											keywords="FTS Portfolio, Technology Projects, Digital Solutions, IT Project Showcase, Development Portfolio"
											type="website"
										/>
										<Projects />
									</>
								}
							/>
							{/* Blog Routes */}
							<Route
								path="/blogs"
								element={
									<>
										<SEO
											title="Our Blog - Technology Insights"
											description="Read the latest insights, trends, and expertise from our team of technology professionals. Web development, mobile apps, cloud solutions, and cybersecurity articles."
											keywords="FTS Blog, Technology Blog, Web Development Blog, Mobile Apps Blog, Cloud Solutions Blog, Cybersecurity Blog, IT Insights Indonesia"
											type="website"
										/>
										<BlogList />
									</>
								}
							/>
							<Route
								path="/blogs/details/:slug"
								element={
									<>
										<SEO
											title="Blog Post"
											description="Read our latest technology insights and expertise from our professional team."
											keywords="FTS Blog Post, Technology Article, IT Insights"
											type="article"
										/>
										<BlogDetail />
									</>
								}
							/>
							{/* Admin Login Route - Internal Use Only */}
							<Route
								path="/login-admin"
								element={
									<>
										<SEO
											title="Admin Login"
											description="Secure admin portal for Fujiyama Technology Solutions internal access."
											keywords="FTS Admin, Internal Access, Secure Login"
											type="website"
										/>
										<LoginAdmin />
									</>
								}
							/>
							{/* Admin Dashboard Routes - Internal Use Only */}
							<Route
								path="/admin"
								element={
									<>
										<SEO
											title="Admin Portal"
											description="Secure admin portal for managing content and settings."
											keywords="FTS Admin Portal, Content Management, Admin Dashboard"
											type="website"
										/>
										<AdminLayout>
											<AdminDashboard />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/dashboard"
								element={
									<>
										<SEO
											title="Admin Dashboard"
											description="Secure admin dashboard for managing projects and content."
											keywords="FTS Admin Dashboard, Project Management, Content Management"
											type="website"
										/>
										<AdminLayout>
											<AdminDashboard />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/projects"
								element={
									<>
										<SEO
											title="Projects Management"
											description="Manage portfolio projects and showcase."
											keywords="FTS Projects, Project Management, Portfolio"
											type="website"
										/>
										<AdminLayout>
											<ProjectManagement />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/projects/new"
								element={
									<>
										<SEO
											title="Add New Project"
											description="Add a new project to the portfolio."
											keywords="FTS Add Project, New Project, Project Creation"
											type="website"
										/>
										<AdminLayout>
											<ProjectForm />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/projects/edit/:id"
								element={
									<>
										<SEO
											title="Edit Project"
											description="Edit existing project details."
											keywords="FTS Edit Project, Project Update, Modify Project"
											type="website"
										/>
										<AdminLayout>
											<ProjectForm />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<>
										<SEO
											title="User Management"
											description="Manage admin users and their access permissions."
											keywords="FTS User Management, Admin Users, Access Control"
											type="website"
										/>
										<AdminLayout>
											<UserManagement />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/activity-logs"
								element={
									<>
										<SEO
											title="Activity Logs"
											description="Monitor and track all system activities and user actions."
											keywords="FTS Activity Logs, System Monitoring, Audit Trail"
											type="website"
										/>
										<AdminLayout>
											<ActivityLogs />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/blogs"
								element={
									<>
										<SEO
											title="Blog Management"
											description="Manage blog posts and content for FTS website."
											keywords="FTS Blog Management, Content Management, Blog Posts"
											type="website"
										/>
										<AdminLayout>
											<AdminBlogs />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/blogs/new"
								element={
									<>
										<SEO
											title="Create New Blog"
											description="Create a new blog post for FTS website."
											keywords="FTS Create Blog, New Blog Post, Content Creation"
											type="website"
										/>
										<AdminLayout>
											<BlogForm />
										</AdminLayout>
									</>
								}
							/>
							<Route
								path="/admin/blogs/edit/:id"
								element={
									<>
										<SEO
											title="Edit Blog Post"
											description="Edit existing blog post for FTS website."
											keywords="FTS Edit Blog, Update Blog Post, Content Editing"
											type="website"
										/>
										<AdminLayout>
											<BlogForm />
										</AdminLayout>
									</>
								}
							/>
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route
								path="*"
								element={
									<>
										<SEO
											title="Page Not Found"
											description="The page you're looking for doesn't exist. Return to Fujiyama Technology Solutions homepage."
											keywords="404 Error, Page Not Found, FTS Indonesia"
											type="website"
										/>
										<NotFound />
									</>
								}
							/>
						</Routes>
					</BrowserRouter>
				</TooltipProvider>
			</AuthProvider>
		</ThemeProvider>
	</QueryClientProvider>
);

export default App;
