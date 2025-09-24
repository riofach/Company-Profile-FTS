import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { COMPANY_NAME, LOGO_SRC } from '@/lib/brand';

// Komponen navigasi utama yang menampilkan brand/logo FTS, kontrol tema,
// dan menu navigasi untuk section pada halaman landing.
const Navigation = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();

	const navItems = [
		{ name: 'Home', href: '#home' },
		{ name: 'About', href: '#about' },
		{ name: 'Services', href: '#services' },
		{ name: 'Pricing', href: '#pricing' },
		{ name: 'Company', href: '#company' },
		{ name: 'Contact', href: '#contact' },
	];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setIsMobileMenuOpen(false);
	};

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? 'border-b bg-white/90 shadow-sm dark:glass' : 'bg-white dark:bg-transparent'
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo / Brand */}
					<motion.button
						type="button"
						aria-label={COMPANY_NAME}
						className="flex items-center space-x-3 focus:outline-none"
						whileHover={{ scale: 1.05 }}
						onClick={() => scrollToSection('#home')}
					>
						<img
							src={LOGO_SRC}
							alt={COMPANY_NAME}
							className="h-8 w-auto rounded-sm select-none"
							draggable={false}
							loading="eager"
						/>
						<span className="text-xl font-bold hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70">
							Fujiyama
						</span>
					</motion.button>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8 text-black dark:text-inherit">
						{navItems.map((item) => (
							<button
								key={item.name}
								onClick={() => scrollToSection(item.href)}
								className="relative py-2 px-3 text-sm font-medium transition-colors hover:text-primary group"
							>
								{item.name}
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
							</button>
						))}
					</div>

					{/* Theme Toggle & Mobile Menu */}
					<div className="flex items-center space-x-2 text-black dark:text-inherit">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
							className="hover:bg-primary/10"
						>
							{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
						</Button>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden hover:bg-primary/10"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden border-t bg-white dark:glass"
						>
							<div className="py-4 space-y-2">
								{navItems.map((item) => (
									<button
										key={item.name}
										onClick={() => scrollToSection(item.href)}
										className="block w-full text-left py-2 px-4 text-sm font-medium hover:bg-primary/10 transition-colors rounded-lg"
									>
										{item.name}
									</button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.nav>
	);
};

export default Navigation;
