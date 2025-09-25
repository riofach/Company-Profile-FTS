import { useEffect } from 'react';
import { ENV_CONFIG } from '@/lib/env';

// Google Analytics component dengan error handling
const Analytics = () => {
	useEffect(() => {
		// Google Analytics setup
		const setupGoogleAnalytics = () => {
			// Pastikan gtag tidak sudah ter-load
			if (typeof window !== 'undefined' && !window.gtag) {
				// Load Google Analytics script
				const script1 = document.createElement('script');
				script1.async = true;
				script1.src = `https://www.googletagmanager.com/gtag/js?id=${ENV_CONFIG.GA_MEASUREMENT_ID}`;
				document.head.appendChild(script1);

				// Initialize gtag
				window.dataLayer = window.dataLayer || [];
				window.gtag = function () {
					window.dataLayer.push(arguments);
				};

				window.gtag('js', new Date());
				window.gtag('config', ENV_CONFIG.GA_MEASUREMENT_ID, {
					anonymize_ip: true,
					allow_google_signals: false,
					allow_ad_personalization_signals: false,
					custom_map: {
						dimension1: 'section',
					},
				});

				// Track page views
				window.gtag('event', 'page_view', {
					page_title: document.title,
					page_location: window.location.href,
					page_path: window.location.pathname,
				});
			}
		};

		// Setup analytics hanya di production
		if (import.meta.env.PROD) {
			setupGoogleAnalytics();
		}

		// Track user interactions
		const trackUserInteractions = () => {
			// Track button clicks
			document.addEventListener('click', (e) => {
				const target = e.target as HTMLElement;
				if (target.tagName === 'BUTTON' || target.tagName === 'A') {
					const buttonText = target.textContent || target.getAttribute('aria-label') || 'Unknown';
					const section = getSectionFromElement(target);

					if (typeof window.gtag !== 'undefined') {
						window.gtag('event', 'click', {
							event_category: 'User Interaction',
							event_label: buttonText,
							custom_parameter_1: section,
						});
					}
				}
			});

			// Track scroll depth
			let maxScroll = 0;
			document.addEventListener('scroll', () => {
				const scrollPercentage = Math.round(
					(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
				);

				if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
					maxScroll = scrollPercentage;
					if (typeof window.gtag !== 'undefined') {
						window.gtag('event', 'scroll', {
							event_category: 'User Engagement',
							event_label: `${scrollPercentage}% scroll depth`,
							value: scrollPercentage,
						});
					}
				}
			});

			// Track time spent on page
			const startTime = Date.now();
			window.addEventListener('beforeunload', () => {
				const timeSpent = Math.round((Date.now() - startTime) / 1000);
				if (typeof window.gtag !== 'undefined') {
					window.gtag('event', 'time_on_page', {
						event_category: 'User Engagement',
						event_label: 'Time spent on page',
						value: timeSpent,
					});
				}
			});
		};

		const getSectionFromElement = (element: HTMLElement): string => {
			const section = element.closest('section');
			if (section && section.id) {
				return section.id;
			}
			return 'unknown';
		};

		trackUserInteractions();
	}, []);

	return null;
};

// Performance monitoring component
const PerformanceMonitor = () => {
	useEffect(() => {
		// Monitor Core Web Vitals
		const monitorWebVitals = () => {
			// Largest Contentful Paint (LCP)
			if ('PerformanceObserver' in window) {
				const observer = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];

					if (typeof window.gtag !== 'undefined') {
						window.gtag('event', 'web_vitals', {
							event_category: 'Web Performance',
							event_label: 'LCP',
							value: Math.round(lastEntry.startTime),
						});
					}
				});

				try {
					observer.observe({ entryTypes: ['largest-contentful-paint'] });
				} catch (e) {
					// Silently handle if LCP is not supported
				}
			}

			// First Input Delay (FID)
			if ('PerformanceObserver' in window) {
				const observer = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						if (typeof window.gtag !== 'undefined') {
							window.gtag('event', 'web_vitals', {
								event_category: 'Web Performance',
								event_label: 'FID',
								value: Math.round(entry.processingStart - entry.startTime),
							});
						}
					});
				});

				try {
					observer.observe({ entryTypes: ['first-input'] });
				} catch (e) {
					// Silently handle if FID is not supported
				}
			}

			// Cumulative Layout Shift (CLS)
			if ('PerformanceObserver' in window) {
				let clsValue = 0;
				const observer = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
						}
					});

					if (typeof window.gtag !== 'undefined') {
						window.gtag('event', 'web_vitals', {
							event_category: 'Web Performance',
							event_label: 'CLS',
							value: Math.round(clsValue * 1000),
						});
					}
				});

				try {
					observer.observe({ entryTypes: ['layout-shift'] });
				} catch (e) {
					// Silently handle if CLS is not supported
				}
			}
		};

		// Monitor performance hanya di production
		if (import.meta.env.PROD) {
			monitorWebVitals();
		}
	}, []);

	return null;
};

// Extend window interface for gtag
declare global {
	interface Window {
		gtag: (command: string, targetId: string, config?: any) => void;
		dataLayer: any[];
	}
}

export { Analytics, PerformanceMonitor };
