import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Search,
	Filter,
	Download,
	RefreshCw,
	Activity,
	User,
	Calendar,
	Settings,
	Eye,
} from 'lucide-react';

// Interface untuk tipe data activity log
interface ActivityLog {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
	resourceType: 'project' | 'user' | 'system';
	resourceId?: string;
	resourceName?: string;
	details?: Record<string, string | number | boolean | object>;
	ipAddress?: string;
	userAgent?: string;
	createdAt: string;
}

// Interface untuk filter options
interface FilterOptions {
	action: string;
	resourceType: string;
	dateFrom: string;
	dateTo: string;
	search: string;
}

// Komponen ActivityLogs untuk tracking dan monitoring aktivitas admin
// Menyediakan interface untuk melihat history semua aktivitas sistem
const ActivityLogs = () => {
	const [logs, setLogs] = useState<ActivityLog[]>([]);
	const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState<FilterOptions>({
		action: '',
		resourceType: '',
		dateFrom: '',
		dateTo: '',
		search: '',
	});
	const [showFilters, setShowFilters] = useState(false);

	// Mock data untuk activity logs
	const mockLogs: ActivityLog[] = [
		{
			id: '1',
			userId: '1',
			userName: 'Admin FTS',
			userEmail: 'admin@fts.biz.id',
			action: 'CREATE',
			resourceType: 'project',
			resourceId: 'proj-001',
			resourceName: 'Tire Reservation',
			details: { title: 'Tire Reservation', tags: ['Laravel', 'PostgreSQL'] },
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			createdAt: '2024-01-15T10:30:00Z',
		},
		{
			id: '2',
			userId: '1',
			userName: 'Admin FTS',
			userEmail: 'admin@fts.biz.id',
			action: 'UPDATE',
			resourceType: 'project',
			resourceId: 'proj-002',
			resourceName: 'Building Maintenance',
			details: { changedFields: ['description', 'tags'] },
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			createdAt: '2024-01-15T11:45:00Z',
		},
		{
			id: '3',
			userId: '1',
			userName: 'Admin FTS',
			userEmail: 'admin@fts.biz.id',
			action: 'DELETE',
			resourceType: 'project',
			resourceId: 'proj-003',
			resourceName: 'Old Project',
			details: { reason: 'Deprecated project' },
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			createdAt: '2024-01-15T14:20:00Z',
		},
		{
			id: '4',
			userId: '1',
			userName: 'Admin FTS',
			userEmail: 'admin@fts.biz.id',
			action: 'LOGIN',
			resourceType: 'system',
			details: { loginMethod: 'email_password' },
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			createdAt: '2024-01-15T09:00:00Z',
		},
		{
			id: '5',
			userId: '1',
			userName: 'Admin FTS',
			userEmail: 'admin@fts.biz.id',
			action: 'LOGOUT',
			resourceType: 'system',
			details: { sessionDuration: '2h 30m' },
			ipAddress: '192.168.1.100',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			createdAt: '2024-01-15T17:30:00Z',
		},
	];

	// Load activity logs
	useEffect(() => {
		loadActivityLogs();
	}, []);

	// Load activity logs dari API
	const loadActivityLogs = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setLogs(mockLogs);
			setFilteredLogs(mockLogs);
		} catch (error) {
			console.error('Failed to load activity logs:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Apply filters to logs
	useEffect(() => {
		let filtered = logs;

		// Filter by action
		if (filters.action) {
			filtered = filtered.filter((log) => log.action === filters.action);
		}

		// Filter by resource type
		if (filters.resourceType) {
			filtered = filtered.filter((log) => log.resourceType === filters.resourceType);
		}

		// Filter by date range
		if (filters.dateFrom) {
			filtered = filtered.filter((log) => new Date(log.createdAt) >= new Date(filters.dateFrom));
		}
		if (filters.dateTo) {
			filtered = filtered.filter((log) => new Date(log.createdAt) <= new Date(filters.dateTo));
		}

		// Filter by search
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(log) =>
					log.userName.toLowerCase().includes(searchLower) ||
					log.userEmail.toLowerCase().includes(searchLower) ||
					log.action.toLowerCase().includes(searchLower) ||
					log.resourceType.toLowerCase().includes(searchLower) ||
					(log.resourceName && log.resourceName.toLowerCase().includes(searchLower))
			);
		}

		setFilteredLogs(filtered);
	}, [logs, filters]);

	// Handle filter change
	const handleFilterChange = (field: keyof FilterOptions, value: string) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			action: '',
			resourceType: '',
			dateFrom: '',
			dateTo: '',
			search: '',
		});
	};

	// Get action badge color
	const getActionBadgeColor = (action: string) => {
		switch (action) {
			case 'CREATE':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'UPDATE':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'DELETE':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			case 'LOGIN':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			case 'LOGOUT':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	};

	// Get resource type icon
	const getResourceTypeIcon = (resourceType: string) => {
		switch (resourceType) {
			case 'project':
				return <Eye className="w-4 h-4" />;
			case 'user':
				return <User className="w-4 h-4" />;
			case 'system':
				return <Settings className="w-4 h-4" />;
			default:
				return <Activity className="w-4 h-4" />;
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(date);
	};

	// Export logs to CSV
	const exportToCSV = () => {
		// TODO: Implement CSV export functionality
		console.log('Export to CSV functionality');
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading activity logs...</p>
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
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-4xl font-bold mb-2">Activity Logs</h1>
						<p className="text-muted-foreground">
							Monitor and track all system activities and user actions
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
							<Filter className="w-4 h-4 mr-2" />
							Filters
						</Button>
						<Button variant="outline" onClick={exportToCSV}>
							<Download className="w-4 h-4 mr-2" />
							Export
						</Button>
						<Button variant="outline" onClick={loadActivityLogs}>
							<RefreshCw className="w-4 h-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Filters Section */}
			{showFilters && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					className="mb-6"
				>
					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">Filter Logs</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="space-y-2">
								<Label htmlFor="action-filter">Action</Label>
								<select
									id="action-filter"
									value={filters.action}
									onChange={(e) => handleFilterChange('action', e.target.value)}
									className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">All Actions</option>
									<option value="CREATE">Create</option>
									<option value="UPDATE">Update</option>
									<option value="DELETE">Delete</option>
									<option value="LOGIN">Login</option>
									<option value="LOGOUT">Logout</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="resource-filter">Resource Type</Label>
								<select
									id="resource-filter"
									value={filters.resourceType}
									onChange={(e) => handleFilterChange('resourceType', e.target.value)}
									className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">All Resources</option>
									<option value="project">Project</option>
									<option value="user">User</option>
									<option value="system">System</option>
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="date-from">Date From</Label>
								<Input
									id="date-from"
									type="date"
									value={filters.dateFrom}
									onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="date-to">Date To</Label>
								<Input
									id="date-to"
									type="date"
									value={filters.dateTo}
									onChange={(e) => handleFilterChange('dateTo', e.target.value)}
								/>
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<div className="flex-1">
								<Input
									placeholder="Search by user, action, or resource..."
									value={filters.search}
									onChange={(e) => handleFilterChange('search', e.target.value)}
									className="w-full"
								/>
							</div>
							<Button variant="outline" onClick={clearFilters}>
								Clear Filters
							</Button>
						</div>
					</Card>
				</motion.div>
			)}

			{/* Logs Table */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<Card className="p-6">
					<div className="mb-4 flex justify-between items-center">
						<h3 className="text-lg font-semibold">Activity History ({filteredLogs.length} logs)</h3>
					</div>

					{filteredLogs.length === 0 ? (
						<div className="text-center py-12">
							<Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								{filters.search || filters.action || filters.resourceType
									? 'No logs found matching your filters.'
									: 'No activity logs yet.'}
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4">Timestamp</th>
										<th className="text-left py-3 px-4">User</th>
										<th className="text-left py-3 px-4">Action</th>
										<th className="text-left py-3 px-4">Resource</th>
										<th className="text-left py-3 px-4">Details</th>
										<th className="text-left py-3 px-4">IP Address</th>
									</tr>
								</thead>
								<tbody>
									{filteredLogs.map((log, index) => (
										<motion.tr
											key={log.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.05 }}
											className="border-b hover:bg-muted/50"
										>
											<td className="py-3 px-4">
												<div className="text-sm">{formatDate(log.createdAt)}</div>
											</td>
											<td className="py-3 px-4">
												<div>
													<div className="font-medium text-sm">{log.userName}</div>
													<div className="text-xs text-muted-foreground">{log.userEmail}</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<Badge className={`text-xs ${getActionBadgeColor(log.action)}`}>
													{log.action}
												</Badge>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-2">
													{getResourceTypeIcon(log.resourceType)}
													<div>
														<div className="text-sm font-medium capitalize">{log.resourceType}</div>
														{log.resourceName && (
															<div className="text-xs text-muted-foreground">
																{log.resourceName}
															</div>
														)}
													</div>
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="text-xs text-muted-foreground">
													{log.details && Object.keys(log.details).length > 0 ? (
														<div>
															{Object.entries(log.details).map(([key, value]) => (
																<div key={key}>
																	<span className="font-medium">{key}:</span>{' '}
																	{typeof value === 'object'
																		? JSON.stringify(value)
																		: String(value)}
																</div>
															))}
														</div>
													) : (
														'-'
													)}
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="text-xs text-muted-foreground font-mono">
													{log.ipAddress || '-'}
												</div>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			</motion.div>
		</div>
	);
};

export default ActivityLogs;
