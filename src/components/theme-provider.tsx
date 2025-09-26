import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system' | 'auto';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: 'system',
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = 'auto',
	storageKey = 'vite-ui-theme',
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme
	);

	// Function to get Indonesian time-based theme
	const getIndonesianTimeTheme = (): 'light' | 'dark' => {
		const now = new Date();
		// Convert to Indonesian timezone (Asia/Jakarta, UTC+7)
		const indonesianTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
		const hour = indonesianTime.getHours();

		// Day time: 6 AM - 6 PM (6:00 - 18:00)
		// Night time: 6 PM - 6 AM (18:00 - 6:00)
		return hour >= 6 && hour < 18 ? 'light' : 'dark';
	};

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');

		let appliedTheme: string;

		if (theme === 'system') {
			appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} else if (theme === 'auto') {
			appliedTheme = getIndonesianTimeTheme();
		} else {
			appliedTheme = theme;
		}

		root.classList.add(appliedTheme);

		// Set up interval to check for theme changes every minute when using auto mode
		let interval: NodeJS.Timeout | null = null;

		if (theme === 'auto') {
			interval = setInterval(() => {
				const newAutoTheme = getIndonesianTimeTheme();
				if (appliedTheme !== newAutoTheme) {
					root.classList.remove('light', 'dark');
					root.classList.add(newAutoTheme);
				}
			}, 60000); // Check every minute
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

	return context;
};
