import { useEffect } from 'react';
import { COMPANY_NAME, SITE_DESCRIPTION } from '@/lib/brand';
import { ENV_CONFIG } from '@/lib/env';

// Interface untuk SEO props yang dapat digunakan di setiap page
interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
	type?: 'website' | 'article' | 'product';
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	section?: string;
}

// SEO Component utama untuk mengelola meta tags dan structured data
const SEO = ({
	title,
	description = SITE_DESCRIPTION,
	keywords = 'Fujiyama Technology Solutions, IT Services Indonesia, Web Development, Mobile Apps, Cloud Solutions, Cybersecurity, Japanese IT Company',
	image = '/Logo FTS.jpg',
	url = ENV_CONFIG.SITE_URL,
	type = 'website',
	publishedTime,
	modifiedTime,
	author = COMPANY_NAME,
	section,
}: SEOProps) => {
	// Generate full title dengan brand name
	const fullTitle = title
		? `${title} | ${COMPANY_NAME}`
		: `${COMPANY_NAME} | Leading IT Services Indonesia`;

	// Generate canonical URL
	const canonicalUrl = `${url}${window.location.pathname}`;

	useEffect(() => {
		// Update document title
		document.title = fullTitle;

		// Update or create meta tags
		const updateMetaTag = (name: string, content: string, property = false) => {
			const attribute = property ? 'property' : 'name';
			let meta = document.querySelector(`meta[${attribute}="${name}"]`);

			if (!meta) {
				meta = document.createElement('meta');
				meta.setAttribute(attribute, name);
				document.head.appendChild(meta);
			}

			meta.setAttribute('content', content);
		};

		// Basic meta tags
		updateMetaTag('description', description);
		updateMetaTag('keywords', keywords);
		updateMetaTag('author', author);
		updateMetaTag(
			'robots',
			'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
		);

		// Open Graph tags
		updateMetaTag('og:title', fullTitle, true);
		updateMetaTag('og:description', description, true);
		updateMetaTag('og:image', `${url}${image}`, true);
		updateMetaTag('og:url', canonicalUrl, true);
		updateMetaTag('og:type', type, true);
		updateMetaTag('og:site_name', COMPANY_NAME, true);
		updateMetaTag('og:locale', 'id_ID', true);

		// Twitter Card tags
		updateMetaTag('twitter:card', 'summary_large_image');
		updateMetaTag('twitter:title', fullTitle);
		updateMetaTag('twitter:description', description);
		updateMetaTag('twitter:image', `${url}${image}`);

		// Article specific tags
		if (type === 'article' && publishedTime) {
			updateMetaTag('article:published_time', publishedTime, true);
			updateMetaTag('article:author', author, true);
			if (section) updateMetaTag('article:section', section, true);
			if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
		}

		// Additional SEO tags
		updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
		updateMetaTag('theme-color', '#1e40af');
		updateMetaTag('msapplication-TileColor', '#1e40af');
		updateMetaTag('application-name', COMPANY_NAME);

		// Canonical link
		let canonical = document.querySelector('link[rel="canonical"]');
		if (!canonical) {
			canonical = document.createElement('link');
			canonical.setAttribute('rel', 'canonical');
			document.head.appendChild(canonical);
		}
		canonical.setAttribute('href', canonicalUrl);
	}, [
		fullTitle,
		description,
		keywords,
		image,
		canonicalUrl,
		type,
		publishedTime,
		modifiedTime,
		author,
		section,
	]);

	// Structured Data (JSON-LD)
	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			// Organization schema
			{
				'@type': 'Organization',
				'@id': `${url}/#organization`,
				name: COMPANY_NAME,
				alternateName: 'FTS',
				url: url,
				logo: {
					'@type': 'ImageObject',
					url: `${url}/Logo FTS.jpg`,
					width: 400,
					height: 400,
				},
				description: description,
				foundingDate: '2013',
				numberOfEmployees: '50+',
				areaServed: [
					{
						'@type': 'Country',
						name: 'Indonesia',
					},
					{
						'@type': 'Country',
						name: 'Japan',
					},
				],
				serviceType: [
					'Web Development',
					'Mobile Application Development',
					'Cloud Solutions',
					'Cybersecurity',
					'Digital Strategy',
					'Performance Optimization',
				],
				hasOfferCatalog: {
					'@type': 'OfferCatalog',
					name: 'IT Services',
					itemListElement: [
						{
							'@type': 'Offer',
							itemOffered: {
								'@type': 'Service',
								name: 'Web Development',
								description: 'Custom web applications built with modern technologies',
							},
						},
						{
							'@type': 'Offer',
							itemOffered: {
								'@type': 'Service',
								name: 'Mobile Development',
								description: 'Native and cross-platform mobile applications',
							},
						},
					],
				},
				sameAs: [
					ENV_CONFIG.SOCIAL_LINKS.linkedin,
					ENV_CONFIG.SOCIAL_LINKS.twitter,
					ENV_CONFIG.SOCIAL_LINKS.facebook,
					ENV_CONFIG.SOCIAL_LINKS.instagram,
				],
			},
			// Website schema
			{
				'@type': 'WebSite',
				'@id': `${url}/#website`,
				url: url,
				name: COMPANY_NAME,
				description: description,
				publisher: {
					'@id': `${url}/#organization`,
				},
				potentialAction: {
					'@type': 'SearchAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: `${url}/search?q={search_term_string}`,
					},
					'query-input': 'required name=search_term_string',
				},
			},
			// WebPage schema
			{
				'@type': 'WebPage',
				'@id': `${canonicalUrl}#webpage`,
				url: canonicalUrl,
				name: fullTitle,
				isPartOf: {
					'@id': `${url}/#website`,
				},
				about: {
					'@id': `${url}/#organization`,
				},
				description: description,
				datePublished: publishedTime || new Date().toISOString(),
				dateModified: modifiedTime || new Date().toISOString(),
				inLanguage: 'id-ID',
				mainEntity: {
					'@id': `${url}/#organization`,
				},
			},
		],
	};

	return (
		<>
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			{/* Preconnect to external domains for performance */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			<link rel="preconnect" href="https://www.google-analytics.com" />
			<link rel="preconnect" href="https://www.googletagmanager.com" />

			{/* DNS prefetch for external resources */}
			<link rel="dns-prefetch" href="//www.google-analytics.com" />
			<link rel="dns-prefetch" href="//fonts.googleapis.com" />
			<link rel="dns-prefetch" href="//www.googletagmanager.com" />
		</>
	);
};

export default SEO;
