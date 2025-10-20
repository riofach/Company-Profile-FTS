// AuthContext untuk FTS Frontend
// Menyediakan authentication state dan fungsi-fungsi terkait auth

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, type User, type AuthTokens } from '@/services/api';

// Interface untuk AuthContext
interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
	children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check if user is authenticated on mount
	useEffect(() => {
		checkAuth();
	}, []);

	// Check authentication status
	const checkAuth = async () => {
		try {
			const token = localStorage.getItem('accessToken');

			if (!token) {
				setIsLoading(false);
				return;
			}

			// Verify token dengan backend
			const response = await authApi.getProfile();

			if (response.success && response.data) {
				setUser(response.data);
			} else {
				// Token invalid, clear storage
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			// Clear storage on error
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		} finally {
			setIsLoading(false);
		}
	};

	// Login function
	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await authApi.login(email, password);

			if (response.success && response.data) {
				const { user: userData, tokens } = response.data;

				// Save tokens to localStorage
				localStorage.setItem('accessToken', tokens.accessToken);
				localStorage.setItem('refreshToken', tokens.refreshToken);

				// Set user state
				setUser(userData);

				return { success: true };
			} else {
				// Trust the sanitized error message from logger (already user-friendly)
				// No need to re-process, logger.getSafeErrorMessage() already handled it
				const errorMessage = response.error || 'An unexpected error occurred. Please try again.';

				return { success: false, error: errorMessage };
			}
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, error: 'An unexpected error occurred' };
		}
	};

	// Logout function
	const logout = async () => {
		try {
			// Call backend logout endpoint
			await authApi.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			// Clear local storage regardless of API call success
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			setUser(null);
		}
	};

	// Refresh token function
	const refreshToken = async () => {
		try {
			const response = await authApi.refreshToken();

			if (response.success && response.data) {
				localStorage.setItem('accessToken', response.data.accessToken);
				localStorage.setItem('refreshToken', response.data.refreshToken);
			} else {
				// Refresh failed, logout user
				await logout();
			}
		} catch (error) {
			console.error('Token refresh error:', error);
			await logout();
		}
	};

	// Setup automatic token refresh
	useEffect(() => {
		if (!user) return;

		// Setup interval untuk refresh token (setiap 14 menit)
		const refreshInterval = setInterval(async () => {
			await refreshToken();
		}, 14 * 60 * 1000); // 14 minutes

		return () => clearInterval(refreshInterval);
	}, [user]);

	// Context value
	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
		refreshToken,
		checkAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};

// HOC untuk protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
	return function AuthenticatedComponent(props: P) {
		const { isAuthenticated, isLoading } = useAuth();

		if (isLoading) {
			return (
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			);
		}

		if (!isAuthenticated) {
			// Redirect ke login page atau show unauthorized message
			window.location.href = '/login-admin';
			return null;
		}

		return <Component {...props} />;
	};
};

export default AuthContext;
