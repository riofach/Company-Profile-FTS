import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { COMPANY_NAME, LOGO_SRC } from '@/lib/brand';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Komponen Login Admin untuk dashboard internal FTS
// Menyediakan interface authentication yang aman dan konsisten dengan brand theme
const LoginAdmin = () => {
	// Auth context
	const { login } = useAuth();

	// Form state
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState('');

	// Hooks
	const { theme } = useTheme();
	const navigate = useNavigate();

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.2,
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
		const newErrors = {
			email: '',
			password: '',
		};
		let isValid = true;

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Invalid email format';
			isValid = false;
		}

		if (!formData.password.trim()) {
			newErrors.password = 'Password is required';
			isValid = false;
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setLoginError('');

		try {
			// Use auth context login function
			const result = await login(formData.email, formData.password);

			if (result.success) {
				// Redirect to admin dashboard
				navigate('/admin/dashboard');
			} else {
				// Show error message
				setLoginError(result.error || 'Login failed. Please try again.');
			}
		} catch (error) {
			console.error('Login error:', error);
			setLoginError('An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Handle input changes
	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
		// Clear login error when user starts typing
		if (loginError) {
			setLoginError('');
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			{/* Background gradient animation */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
			</div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 w-full max-w-md"
			>
				{/* Logo and Brand */}
				<motion.div variants={itemVariants} className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
							<img
								src={LOGO_SRC}
								alt={COMPANY_NAME}
								className="relative w-20 h-20 rounded-lg select-none"
								draggable={false}
							/>
						</div>
					</div>
					<h1 className="text-2xl font-bold gradient-text mb-2">Admin Portal</h1>
					<p className="text-muted-foreground">{COMPANY_NAME} - Internal Access</p>
				</motion.div>

				{/* Login Form Card */}
				<motion.div variants={itemVariants}>
					<Card className="p-8 backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
						{/* Security Badge */}
						<div className="flex items-center justify-center mb-6">
							<div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
								<Shield className="w-4 h-4 text-primary" />
								<span className="text-xs font-medium text-primary">Secure Access</span>
							</div>
						</div>

						{/* Login Error Alert */}
						{loginError && (
							<Alert className="mb-6 bg-destructive/5 border-destructive/20">
								<AlertDescription className="text-sm text-destructive">
									{loginError}
								</AlertDescription>
							</Alert>
						)}

						{/* Alert for demo purposes */}
						<Alert className="mb-6 bg-primary/5 border-primary/20">
							<AlertDescription className="text-sm">
								This is a secure admin portal. Unauthorized access is prohibited.
							</AlertDescription>
						</Alert>

						{/* Login Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email Field */}
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									Email
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className="pl-10"
										disabled={isLoading}
									/>
								</div>
								{errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										value={formData.password}
										onChange={(e) => handleInputChange('password', e.target.value)}
										className="pl-10 pr-10"
										disabled={isLoading}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLoading}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
									</Button>
								</div>
								{errors.password && (
									<p className="text-xs text-destructive mt-1">{errors.password}</p>
								)}
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
										<span>Authenticating...</span>
									</div>
								) : (
									'Sign In'
								)}
							</Button>
						</form>

						{/* Additional Options */}
						<div className="mt-6 text-center">
							<p className="text-xs text-muted-foreground">
								Trouble accessing? Contact system administrator
							</p>
						</div>
					</Card>
				</motion.div>

				{/* Footer Info */}
				<motion.div variants={itemVariants} className="text-center mt-8">
					<p className="text-xs text-muted-foreground">
						© 2025 {COMPANY_NAME}. All rights reserved.
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default LoginAdmin;
