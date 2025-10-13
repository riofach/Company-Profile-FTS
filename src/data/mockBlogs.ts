// Mock data untuk blog posts FTS
// Interface untuk blog data structure

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	author: {
		name: string;
		role: string;
		avatar: string;
	};
	featuredImage: string;
	category: string;
	tags: string[];
	publishedAt: string;
	updatedAt: string;
	readTime: number; // in minutes
	isPublished: boolean;
	views: number;
}

// Mock blog data untuk FTS Company Profile
export const mockBlogs: BlogPost[] = [
	{
		id: '1',
		title: 'The Future of Web Development: Trends to Watch in 2024',
		slug: 'future-web-development-trends-2024',
		excerpt:
			'Explore the latest trends in web development that are shaping the digital landscape in 2024, from AI integration to performance optimization.',
		content: `
			<h2>Introduction</h2>
			<p>The web development landscape is constantly evolving, and 2024 brings exciting new trends that are reshaping how we build digital experiences. At Fujiyama Technology Solutions, we're at the forefront of these innovations, helping businesses stay competitive in the digital age.</p>
			
			<h2>Key Trends to Watch</h2>
			<h3>1. AI-Powered Development</h3>
			<p>Artificial Intelligence is revolutionizing web development, from automated code generation to intelligent user interfaces. Tools like GitHub Copilot and ChatGPT are becoming essential for developers.</p>
			
			<h3>2. Performance Optimization</h3>
			<p>Core Web Vitals continue to be crucial for SEO and user experience. We're seeing increased focus on:</p>
			<ul>
				<li>Server-Side Rendering (SSR) improvements</li>
				<li>Edge computing integration</li>
				<li>Advanced caching strategies</li>
			</ul>
			
			<h3>3. Progressive Web Apps (PWAs)</h3>
			<p>PWAs are bridging the gap between web and mobile applications, offering native app-like experiences through web technologies.</p>
			
			<h2>Conclusion</h2>
			<p>Staying ahead of these trends is crucial for businesses looking to maintain a competitive edge. At FTS, we help our clients implement these cutting-edge technologies to drive growth and innovation.</p>
		`,
		author: {
			name: 'Yoshihiro Nakagawa',
			role: 'CEO',
			avatar: './images/yoshi.webp',
		},
		featuredImage: '/images/blog-web-development.jpg',
		category: 'Technology',
		tags: ['Web Development', 'AI', 'Performance', 'Trends'],
		publishedAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
		readTime: 8,
		isPublished: true,
		views: 1250,
	},
	{
		id: '2',
		title: 'Cybersecurity Best Practices for Indonesian Businesses',
		slug: 'cybersecurity-best-practices-indonesian-businesses',
		excerpt:
			'Essential cybersecurity strategies that Indonesian businesses should implement to protect their digital assets and maintain customer trust.',
		content: `
			<h2>Why Cybersecurity Matters in Indonesia</h2>
			<p>With Indonesia's rapid digital transformation, cybersecurity has become more critical than ever. Businesses face increasing threats from cybercriminals targeting valuable data and systems.</p>
			
			<h2>Essential Security Measures</h2>
			<h3>1. Multi-Factor Authentication (MFA)</h3>
			<p>Implement MFA across all business systems to add an extra layer of security beyond passwords.</p>
			
			<h3>2. Regular Security Audits</h3>
			<p>Conduct quarterly security assessments to identify vulnerabilities and update security protocols.</p>
			
			<h3>3. Employee Training</h3>
			<p>Educate your team about phishing attacks, social engineering, and safe browsing practices.</p>
			
			<h3>4. Data Encryption</h3>
			<p>Encrypt sensitive data both in transit and at rest to protect against unauthorized access.</p>
			
			<h2>FTS Security Solutions</h2>
			<p>At Fujiyama Technology Solutions, we provide comprehensive cybersecurity services tailored for Indonesian businesses, including:</p>
			<ul>
				<li>Security assessments and penetration testing</li>
				<li>Implementation of security frameworks</li>
				<li>24/7 security monitoring</li>
				<li>Incident response planning</li>
			</ul>
		`,
		author: {
			name: 'Azmi Roza',
			role: 'COO',
			avatar: './images/azmi.webp',
		},
		featuredImage: '/images/blog-cybersecurity.jpg',
		category: 'Security',
		tags: ['Cybersecurity', 'Business', 'Indonesia', 'Security'],
		publishedAt: '2024-01-10T14:30:00Z',
		updatedAt: '2024-01-10T14:30:00Z',
		readTime: 6,
		isPublished: true,
		views: 890,
	},
	{
		id: '3',
		title: 'Mobile App Development: Native vs Cross-Platform',
		slug: 'mobile-app-development-native-vs-cross-platform',
		excerpt:
			'A comprehensive comparison of native and cross-platform mobile app development approaches, helping you choose the right strategy for your business.',
		content: `
			<h2>Understanding Mobile Development Approaches</h2>
			<p>Choosing between native and cross-platform development is one of the most important decisions in mobile app development. Each approach has its advantages and trade-offs.</p>
			
			<h2>Native Development</h2>
			<h3>Advantages:</h3>
			<ul>
				<li>Optimal performance and user experience</li>
				<li>Access to all platform-specific features</li>
				<li>Better security and data protection</li>
				<li>Superior graphics and animations</li>
			</ul>
			
			<h3>Disadvantages:</h3>
			<ul>
				<li>Higher development costs</li>
				<li>Longer development time</li>
				<li>Need for separate development teams</li>
			</ul>
			
			<h2>Cross-Platform Development</h2>
			<h3>Advantages:</h3>
			<ul>
				<li>Single codebase for multiple platforms</li>
				<li>Faster development and deployment</li>
				<li>Lower development costs</li>
				<li>Easier maintenance</li>
			</ul>
			
			<h3>Disadvantages:</h3>
			<ul>
				<li>Performance limitations</li>
				<li>Limited access to platform features</li>
				<li>Dependency on framework updates</li>
			</ul>
			
			<h2>Our Recommendation</h2>
			<p>At FTS, we help clients choose the right approach based on their specific requirements, budget, and timeline. We specialize in both native and cross-platform development using modern frameworks like React Native and Flutter.</p>
		`,
		author: {
			name: 'Naoki Yoshida',
			role: 'Director',
			avatar: './images/naoki.webp',
		},
		featuredImage: '/images/blog-mobile-development.jpg',
		category: 'Mobile Development',
		tags: ['Mobile Apps', 'Development', 'Technology', 'Comparison'],
		publishedAt: '2024-01-05T09:15:00Z',
		updatedAt: '2024-01-05T09:15:00Z',
		readTime: 10,
		isPublished: true,
		views: 2100,
	},
	{
		id: '4',
		title: 'Cloud Migration Strategies for Indonesian Enterprises',
		slug: 'cloud-migration-strategies-indonesian-enterprises',
		excerpt:
			'Learn how Indonesian enterprises can successfully migrate to the cloud while maintaining security, compliance, and operational efficiency.',
		content: `
			<h2>The Cloud Revolution in Indonesia</h2>
			<p>Cloud computing is transforming how Indonesian businesses operate, offering scalability, flexibility, and cost-effectiveness. However, successful cloud migration requires careful planning and execution.</p>
			
			<h2>Migration Strategies</h2>
			<h3>1. Lift and Shift</h3>
			<p>Move applications to the cloud with minimal changes. Best for simple applications with low complexity.</p>
			
			<h3>2. Replatforming</h3>
			<p>Make minor optimizations to applications during migration to take advantage of cloud features.</p>
			
			<h3>3. Refactoring</h3>
			<p>Completely redesign applications to be cloud-native, maximizing cloud benefits.</p>
			
			<h2>Key Considerations</h2>
			<ul>
				<li>Data sovereignty and compliance requirements</li>
				<li>Security and access controls</li>
				<li>Cost optimization strategies</li>
				<li>Disaster recovery planning</li>
			</ul>
			
			<h2>FTS Cloud Solutions</h2>
			<p>We provide end-to-end cloud migration services, from assessment and planning to implementation and optimization. Our team ensures smooth transitions with minimal downtime.</p>
		`,
		author: {
			name: 'Takaki Morita',
			role: 'Director',
			avatar: './images/takaki.webp',
		},
		featuredImage: '/images/blog-cloud-migration.jpg',
		category: 'Cloud Solutions',
		tags: ['Cloud Computing', 'Migration', 'Enterprise', 'Strategy'],
		publishedAt: '2024-01-01T08:00:00Z',
		updatedAt: '2024-01-01T08:00:00Z',
		readTime: 7,
		isPublished: true,
		views: 1560,
	},
	{
		id: '5',
		title: 'Digital Transformation in Indonesian SMEs',
		slug: 'digital-transformation-indonesian-smes',
		excerpt:
			'How small and medium enterprises in Indonesia can leverage digital transformation to compete in the modern economy.',
		content: `
			<h2>The Digital Imperative</h2>
			<p>Digital transformation is no longer optional for Indonesian SMEs. It's a necessity for survival and growth in today's competitive market.</p>
			
			<h2>Key Areas for Digital Transformation</h2>
			<h3>1. E-commerce Platforms</h3>
			<p>Establishing online presence through custom e-commerce solutions tailored for Indonesian market needs.</p>
			
			<h3>2. Customer Relationship Management</h3>
			<p>Implementing CRM systems to better understand and serve customers.</p>
			
			<h3>3. Process Automation</h3>
			<p>Streamlining business processes through automation to improve efficiency and reduce costs.</p>
			
			<h3>4. Data Analytics</h3>
			<p>Leveraging data to make informed business decisions and identify growth opportunities.</p>
			
			<h2>Success Stories</h2>
			<p>We've helped numerous Indonesian SMEs transform their operations through technology, resulting in increased efficiency, better customer service, and higher profitability.</p>
			
			<h2>Getting Started</h2>
			<p>Digital transformation doesn't have to be overwhelming. Start with small, manageable steps and gradually expand your digital capabilities.</p>
		`,
		author: {
			name: 'Takakazu Kaburaki',
			role: 'Director',
			avatar: './images/takakazu.webp',
		},
		featuredImage: '/images/blog-digital-transformation.jpg',
		category: 'Digital Transformation',
		tags: ['SME', 'Digital Transformation', 'Business', 'Indonesia'],
		publishedAt: '2023-12-28T16:45:00Z',
		updatedAt: '2023-12-28T16:45:00Z',
		readTime: 9,
		isPublished: true,
		views: 980,
	},
];

// Helper functions untuk blog data
export const getBlogBySlug = (slug: string): BlogPost | undefined => {
	return mockBlogs.find((blog) => blog.slug === slug && blog.isPublished);
};

export const getPublishedBlogs = (): BlogPost[] => {
	return mockBlogs
		.filter((blog) => blog.isPublished)
		.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getBlogsByCategory = (category: string): BlogPost[] => {
	return getPublishedBlogs().filter(
		(blog) => blog.category.toLowerCase() === category.toLowerCase()
	);
};

export const getBlogsByTag = (tag: string): BlogPost[] => {
	return getPublishedBlogs().filter((blog) =>
		blog.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
	);
};

export const getRelatedBlogs = (currentBlog: BlogPost, limit: number = 3): BlogPost[] => {
	const related = getPublishedBlogs()
		.filter(
			(blog) =>
				blog.id !== currentBlog.id &&
				(blog.category === currentBlog.category ||
					blog.tags.some((tag) => currentBlog.tags.includes(tag)))
		)
		.slice(0, limit);

	return related;
};
