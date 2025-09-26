import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import SEO from '@/components/SEO';
import { Analytics, PerformanceMonitor } from '@/components/Analytics';
// Pembungkus global aplikasi: QueryClient, ThemeProvider, Tooltip, Toaster, dan Router.
import Index from './pages/Index';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="auto" storageKey="fts-theme">
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
		</ThemeProvider>
	</QueryClientProvider>
);

export default App;
