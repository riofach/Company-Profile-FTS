import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Plus,
	Edit,
	Trash2,
	Search,
	Users,
	Mail,
	Calendar,
	Shield,
	UserPlus,
	Eye,
	EyeOff,
	Save,
	X,
	User as UserIcon,
	Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminApi, type User } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Interface untuk form user
interface UserFormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: 'admin' | 'super_admin';
}

// Komponen UserManagement untuk manage admin users
// Menyediakan interface untuk CRUD operations pada admin users
const UserManagement = () => {
	// Hooks
	const { toast } = useToast();
	const { user } = useAuth();
	const navigate = useNavigate();

	// State
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [showForm, setShowForm] = useState(false);

	// Form state
	const [formData, setFormData] = useState<UserFormData>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'admin',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Load users
	useEffect(() => {
		loadUsers();
	}, []);

	// Load users dari API
	const loadUsers = async () => {
		setIsLoading(true);
		try {
			const response = await adminApi.getUsers();

			if (response.success && response.data) {
				setUsers(response.data);
				setFilteredUsers(response.data);
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to load users',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to load users:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Filter users based on search term
	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.role.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredUsers(filtered);
	}, [users, searchTerm]);

	// Form validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		let isValid = true;

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
			isValid = false;
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Invalid email format';
			isValid = false;
		}

		if (!isEditing) {
			if (!formData.password.trim()) {
				newErrors.password = 'Password must be at least 6 characters long';
				isValid = false;
			} else if (formData.password.length < 6) {
				newErrors.password = 'Password must be at least 6 characters long';
				isValid = false;
			} else if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
				newErrors.password =
					'Password must be at least 6 characters long and contain only letters and numbers';
				isValid = false;
			}

			if (!formData.confirmPassword.trim()) {
				newErrors.confirmPassword = 'Please confirm password';
				isValid = false;
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = 'Passwords do not match';
				isValid = false;
			}
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
			let response;

			if (isEditing && editingUser) {
				// Update existing user
				response = await adminApi.updateUser(editingUser.id, {
					name: formData.name,
					email: formData.email,
					role: formData.role,
				});

				if (response.success && response.data) {
					setUsers((prev) =>
						prev.map((user) => (user.id === editingUser.id ? response.data! : user))
					);
					toast({
						title: 'Success',
						description: 'User updated successfully',
					});
				}
			} else {
				// Create new user
				response = await adminApi.createUser({
					name: formData.name,
					email: formData.email,
					password: formData.password,
					role: formData.role,
				});

				if (response.success && response.data) {
					setUsers((prev) => [...prev, response.data!]);
					toast({
						title: 'Success',
						description: 'User created successfully',
					});
				}
			}

			if (response.success) {
				// Reset form
				resetForm();
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to save user',
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
		}
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: 'admin',
		});
		setErrors({});
		setIsEditing(false);
		setEditingUser(null);
		setShowForm(false);
		setShowPassword(false);
		setShowConfirmPassword(false);
	};

	// Handle input changes
	const handleInputChange = (field: keyof UserFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	// Handle edit user
	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			password: '',
			confirmPassword: '',
			role: user.role,
		});
		setIsEditing(true);
		setShowForm(true);
	};

	// Handle delete user
	const handleDeleteUser = async (userId: string) => {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			const response = await adminApi.deleteUser(userId);

			if (response.success) {
				setUsers((prev) => prev.filter((user) => user.id !== userId));
				toast({
					title: 'Success',
					description: 'User deleted successfully',
				});
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to delete user',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to delete user:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		}
	};

	// Handle toggle user status
	const handleToggleUserStatus = async (userId: string) => {
		try {
			const user = users.find((u) => u.id === userId);
			if (!user) return;

			const response = await adminApi.updateUser(userId, {
				// Note: Backend needs to support isActive field
				// For now, we'll just update the local state
			});

			if (response.success) {
				setUsers((prev) =>
					prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
				);
				toast({
					title: 'Success',
					description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
				});
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to update user status',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Failed to toggle user status:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		}
	};

	// Get role badge color
	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case 'super_admin':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			case 'admin':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
		}).format(date);
	};

	// Check if user has permission to access this page
	if (user?.role !== 'super_admin') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
					<h2 className="text-2xl font-bold mb-2">Access Denied</h2>
					<p className="text-muted-foreground mb-4">
						You don't have permission to access User Management.
					</p>
					<Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading users...</p>
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
						<h1 className="text-4xl font-bold mb-2">User Management</h1>
						<p className="text-muted-foreground">Manage admin users and their access permissions</p>
					</div>
					<Button
						onClick={() => setShowForm(true)}
						className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
					>
						<UserPlus className="w-4 h-4 mr-2" />
						Add New User
					</Button>
				</div>
			</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.1 }}
				className="mb-6"
			>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<input
						type="text"
						placeholder="Search users by name, email, or role..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
				</div>
			</motion.div>

			{/* User Form Modal */}
			{showForm && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={() => !isSubmitting && resetForm()}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<Card className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">{isEditing ? 'Edit User' : 'Add New User'}</h2>
								<Button variant="ghost" size="icon" onClick={resetForm} disabled={isSubmitting}>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name */}
								<div className="space-y-2">
									<Label htmlFor="name">Name *</Label>
									<Input
										id="name"
										type="text"
										placeholder="Enter user name"
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										disabled={isSubmitting}
									/>
									{errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
								</div>

								{/* Email */}
								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter email address"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										disabled={isSubmitting}
									/>
									{errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
								</div>

								{/* Role */}
								<div className="space-y-2">
									<Label htmlFor="role">Role *</Label>
									<select
										id="role"
										value={formData.role}
										onChange={(e) => handleInputChange('role', e.target.value)}
										disabled={isSubmitting}
										className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="admin">Admin</option>
										<option value="super_admin">Super Admin</option>
									</select>
								</div>

								{/* Password (only for new users) */}
								{!isEditing && (
									<>
										<div className="space-y-2">
											<Label htmlFor="password">Password *</Label>
											<div className="relative">
												<Input
													id="password"
													type={showPassword ? 'text' : 'password'}
													placeholder="Enter password"
													value={formData.password}
													onChange={(e) => handleInputChange('password', e.target.value)}
													disabled={isSubmitting}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className="w-4 h-4" />
													) : (
														<Eye className="w-4 h-4" />
													)}
												</Button>
											</div>
											{errors.password && (
												<p className="text-xs text-destructive mt-1">{errors.password}</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirmPassword">Confirm Password *</Label>
											<div className="relative">
												<Input
													id="confirmPassword"
													type={showConfirmPassword ? 'text' : 'password'}
													placeholder="Confirm password"
													value={formData.confirmPassword}
													onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
													disabled={isSubmitting}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												>
													{showConfirmPassword ? (
														<EyeOff className="w-4 h-4" />
													) : (
														<Eye className="w-4 h-4" />
													)}
												</Button>
											</div>
											{errors.confirmPassword && (
												<p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
											)}
										</div>
									</>
								)}

								{/* Form Actions */}
								<div className="flex gap-4 pt-6">
									<Button
										type="submit"
										className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<div className="flex items-center space-x-2">
												<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
												<span>{isEditing ? 'Updating...' : 'Creating...'}</span>
											</div>
										) : (
											<div className="flex items-center space-x-2">
												<Save className="w-4 h-4" />
												<span>{isEditing ? 'Update User' : 'Create User'}</span>
											</div>
										)}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={resetForm}
										disabled={isSubmitting}
									>
										Cancel
									</Button>
								</div>
							</form>
						</Card>
					</motion.div>
				</motion.div>
			)}

			{/* Users List */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<Card className="p-6">
					<div className="mb-4">
						<h3 className="text-lg font-semibold">Admin Users ({filteredUsers.length})</h3>
					</div>

					{filteredUsers.length === 0 ? (
						<div className="text-center py-12">
							<Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								{searchTerm ? 'No users found matching your search.' : 'No users yet.'}
							</p>
							{!searchTerm && (
								<Button
									onClick={() => setShowForm(true)}
									className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
								>
									<UserPlus className="w-4 h-4 mr-2" />
									Add Your First User
								</Button>
							)}
						</div>
					) : (
						<div className="space-y-4">
							{filteredUsers.map((user, index) => (
								<motion.div
									key={user.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
								>
									<Card className="p-6 hover:shadow-lg transition-all duration-300">
										<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
														<UserIcon className="w-5 h-5 text-primary" />
													</div>
													<div>
														<h4 className="text-lg font-semibold">{user.name}</h4>
														<p className="text-sm text-muted-foreground">{user.email}</p>
													</div>
												</div>
												<div className="flex flex-wrap gap-2 mb-3">
													<Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
														<Shield className="w-3 h-3 mr-1" />
														{user.role.replace('_', ' ')}
													</Badge>
													<Badge variant={user.isActive ? 'default' : 'secondary'}>
														{user.isActive ? 'Active' : 'Inactive'}
													</Badge>
												</div>
												<div className="text-xs text-muted-foreground space-y-1">
													<div className="flex items-center gap-2">
														<Calendar className="w-3 h-3" />
														Created: {formatDate(user.createdAt)}
													</div>
													{user.lastLoginAt && (
														<div className="flex items-center gap-2">
															<Mail className="w-3 h-3" />
															Last Login: {formatDate(user.lastLoginAt)}
														</div>
													)}
												</div>
											</div>

											{/* Action Buttons */}
											<div className="flex flex-row sm:flex-col gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditUser(user)}
													className="flex items-center space-x-2"
												>
													<Edit className="w-4 h-4" />
													<span>Edit</span>
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleToggleUserStatus(user.id)}
													className="flex items-center space-x-2"
												>
													<Settings className="w-4 h-4" />
													<span>{user.isActive ? 'Deactivate' : 'Activate'}</span>
												</Button>
												{user.email !== 'admin@fts.biz.id' && (
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDeleteUser(user.id)}
														className="flex items-center space-x-2"
													>
														<Trash2 className="w-4 h-4" />
														<span>Delete</span>
													</Button>
												)}
											</div>
										</div>
									</Card>
								</motion.div>
							))}
						</div>
					)}
				</Card>
			</motion.div>
		</div>
	);
};

export default UserManagement;
