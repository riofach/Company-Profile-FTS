import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Menu,
	X,
	Home,
	FolderOpen,
	Settings,
	Users,
	Activity,
	LogOut,
	ChevronLeft,
	ChevronDown,
	Sun,
	Moon,
	Monitor,
	Clock,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY_NAME, LOGO_SRC } from '@/lib/brand';
import { useTheme, type Theme } from '@/components/theme-provider';

// Interface untuk navigation item
interface NavItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	path: string;
	badge?: number;
	children?: NavItem[];
}

// Komponen AdminLayout untuk menyediakan layout konsisten untuk admin pages
// Menyediakan sidebar navigation dan header dengan theme control
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const { theme, setTheme } = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	// Function to get the next theme in cycle: light -> dark -> system -> auto -> light...
	const getNextTheme = (currentTheme: string): Theme => {
		const themeCycle: Theme[] = ['light', 'dark', 'system', 'auto'];
		const currentIndex = themeCycle.indexOf(currentTheme as Theme);
		const nextIndex = (currentIndex + 1) % themeCycle.length;
		return themeCycle[nextIndex];
	};

	// Function to get theme icon
	const getThemeIcon = (currentTheme: string) => {
		switch (currentTheme) {
			case 'light':
				return <Sun className="h-4 w-4" />;
			case 'dark':
				return <Moon className="h-4 w-4" />;
			case 'system':
				return <Monitor className="h-4 w-4" />;
			case 'auto':
				return <Clock className="h-4 w-4" />;
			default:
				return <Sun className="h-4 w-4" />;
		}
	};

	// Function to get theme label
	const getThemeLabel = (currentTheme: string) => {
		switch (currentTheme) {
			case 'light':
				return 'Light Mode';
			case 'dark':
				return 'Dark Mode';
			case 'system':
				return 'System';
			case 'auto':
				return 'Auto (Indonesian Time)';
			default:
				return 'Light Mode';
		}
	};

	// Navigation items configuration
	const navItems: NavItem[] = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			icon: <Home className="w-4 h-4" />,
			path: '/admin/dashboard',
		},
		{
			id: 'projects',
			label: 'Projects',
			icon: <FolderOpen className="w-4 h-4" />,
			path: '/admin/projects',
		},
		{
			id: 'users',
			label: 'User Management',
			icon: <Users className="w-4 h-4" />,
			path: '/admin/users',
		},
		{
			id: 'activity',
			label: 'Activity Logs',
			icon: <Activity className="w-4 h-4" />,
			path: '/admin/activity-logs',
		},
	];

	// Toggle sidebar expansion
	const toggleExpand = (itemId: string) => {
		setExpandedItems((prev) =>
			prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
		);
	};

	// Check if navigation item is active
	const isActive = (path: string) => {
		return location.pathname === path;
	};

	// Handle logout
	const handleLogout = () => {
		// TODO: Implement logout logic
		navigate('/login-admin');
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile Menu Button */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="bg-background/80 backdrop-blur-sm"
				>
					<Menu className="h-4 w-4" />
				</Button>
			</div>

			{/* Sidebar */}
			<AnimatePresence>
				<motion.aside
					initial={false}
					animate={{ width: isSidebarOpen ? '100%' : '0px' }}
					exit={{ width: '0px' }}
					className={`fixed inset-y-0 left-0 z-40 bg-background border-r lg:hidden ${
						isSidebarOpen ? 'block' : 'hidden'
					}`}
				>
					<div className="flex flex-col h-full w-64">
						{/* Sidebar Header */}
						<div className="flex items-center justify-between p-4 border-b">
							<div className="flex items-center space-x-3">
								<img
									src={LOGO_SRC}
									alt={COMPANY_NAME}
									className="h-8 w-auto rounded-sm select-none"
									draggable={false}
									loading="eager"
								/>
								<span className="text-lg font-bold">Admin</span>
							</div>
							<Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Navigation Items */}
						<nav className="flex-1 p-4 space-y-2">
							{navItems.map((item) => (
								<div key={item.id}>
									<Link
										to={item.path}
										onClick={() => setIsSidebarOpen(false)}
										className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
											isActive(item.path) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
										}`}
									>
										{item.icon}
										<span className="flex-1">{item.label}</span>
										{item.badge && (
											<Badge variant="secondary" className="ml-auto">
												{item.badge}
											</Badge>
										)}
									</Link>
								</div>
							))}
						</nav>

						{/* Sidebar Footer */}
						<div className="p-4 border-t space-y-2">
							{/* Theme Toggle */}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setTheme(getNextTheme(theme))}
								className="w-full justify-start"
							>
								{getThemeIcon(theme)}
								<span className="ml-2">{getThemeLabel(theme)}</span>
							</Button>

							{/* Logout */}
							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="w-full justify-start"
							>
								<LogOut className="w-4 h-4" />
								<span className="ml-2">Logout</span>
							</Button>
						</div>
					</div>
				</motion.aside>
			</AnimatePresence>

			{/* Desktop Sidebar */}
			<motion.aside
				initial={{ width: 0 }}
				animate={{ width: '256px' }}
				className="hidden lg:flex fixed inset-y-0 left-0 z-40 bg-background border-r"
			>
				<div className="flex flex-col h-full">
					{/* Sidebar Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center space-x-3">
							<img
								src={LOGO_SRC}
								alt={COMPANY_NAME}
								className="h-8 w-auto rounded-sm select-none"
								draggable={false}
								loading="eager"
							/>
							<span className="text-lg font-bold">Admin Portal</span>
						</div>
					</div>

					{/* Navigation Items */}
					<nav className="flex-1 p-4 space-y-2">
						{navItems.map((item) => (
							<div key={item.id}>
								<Link
									to={item.path}
									className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
										isActive(item.path) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
									}`}
								>
									{item.icon}
									<span className="flex-1">{item.label}</span>
									{item.badge && (
										<Badge variant="secondary" className="ml-auto">
											{item.badge}
										</Badge>
									)}
								</Link>
							</div>
						))}
					</nav>

					{/* Sidebar Footer */}
					<div className="p-4 border-t space-y-2">
						{/* Theme Toggle */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setTheme(getNextTheme(theme))}
							className="w-full justify-start"
						>
							{getThemeIcon(theme)}
							<span className="ml-2">{getThemeLabel(theme)}</span>
						</Button>

						{/* Logout */}
						<Button
							variant="outline"
							size="sm"
							onClick={handleLogout}
							className="w-full justify-start"
						>
							<LogOut className="w-4 h-4" />
							<span className="ml-2">Logout</span>
						</Button>
					</div>
				</div>
			</motion.aside>

			{/* Main Content */}
			<div className="lg:ml-64">
				{/* Top Navigation Bar */}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b"
				>
					<div className="flex items-center justify-between px-4 py-3">
						<div className="flex items-center space-x-4">
							{/* Mobile Menu Button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className="lg:hidden"
							>
								<Menu className="h-4 w-4" />
							</Button>

							{/* Page Title */}
							<div className="flex items-center space-x-2">
								{navItems.find((item) => isActive(item.path)) && (
									<>
										{navItems.find((item) => isActive(item.path))?.icon}
										<span className="font-medium">
											{navItems.find((item) => isActive(item.path))?.label}
										</span>
									</>
								)}
							</div>
						</div>

						<div className="flex items-center space-x-2">
							{/* View Site Button */}
							<Button variant="outline" asChild>
								<Link to="/" className="flex items-center space-x-2">
									<span>View Site</span>
								</Link>
							</Button>

							{/* Theme Toggle (Mobile) */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setTheme(getNextTheme(theme))}
								className="lg:hidden"
								title={getThemeLabel(theme)}
							>
								{getThemeIcon(theme)}
							</Button>
						</div>
					</div>
				</motion.header>

				{/* Page Content */}
				<motion.main
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="min-h-[calc(100vh-4rem)]"
				>
					{children}
				</motion.main>
			</div>
		</div>
	);
};

export default AdminLayout;
