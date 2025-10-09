import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
	Code,
	Smartphone,
	Cloud,
	Shield,
	Zap,
	Globe,
	ArrowRight,
	CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.1,
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

	// Services dengan image untuk visual enhancement
	const services = [
		{
			icon: Code,
			title: 'Web Development Services',
			description:
				'Custom web applications built with modern technologies and frameworks for optimal performance and user experience. We specialize in React, Next.js, and full-stack development for businesses in Indonesia.',
			features: [
				'React & Next.js Development',
				'Full-Stack Solutions',
				'API Integration',
				'Responsive Web Design',
			],
			image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
		},
		{
			icon: Smartphone,
			title: 'Mobile App Development',
			description:
				'Native and cross-platform mobile applications that deliver seamless experiences across all devices. From iOS to Android development with Indonesian market optimization.',
			features: [
				'iOS & Android Development',
				'React Native Apps',
				'Flutter Development',
				'App Store Optimization',
			],
			image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
		},
		{
			icon: Cloud,
			title: 'Cloud Infrastructure Solutions',
			description:
				'Scalable cloud infrastructure and services that grow with your business needs and ensure reliability. AWS and Azure deployment with Indonesian data center optimization.',
			features: [
				'AWS & Azure Deployment',
				'Serverless Architecture',
				'DevOps Services',
				'Auto-scaling Solutions',
			],
			image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
		},
		{
			icon: Shield,
			title: 'Cybersecurity Services',
			description:
				'Comprehensive security solutions to protect your digital assets and ensure compliance with Indonesian and international industry standards. Protect your business from cyber threats.',
			features: [
				'Security Audits & Testing',
				'Penetration Testing',
				'Compliance Management',
				'24/7 Security Monitoring',
			],
			image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
		},
		{
			icon: Zap,
			title: 'Performance Optimization',
			description:
				'Advanced optimization techniques to maximize application speed, efficiency, and user satisfaction. Improve your website and app performance for better business results.',
			features: [
				'Load Testing Services',
				'Code Optimization',
				'CDN Setup & Configuration',
				'Performance Monitoring Tools',
			],
			image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
		},
		{
			icon: Globe,
			title: 'Digital Transformation Strategy',
			description:
				'Strategic consulting to help you navigate digital transformation and achieve your business objectives. Tailored digital strategies for Indonesian businesses with Japanese precision.',
			features: [
				'Technology Roadmap Planning',
				'Digital Transformation Consulting',
				'IT Strategy Development',
				'Market Analysis & Research',
			],
			image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
		},
	];

	// Stats data untuk visualisasi
	const stats = [
		{ number: '50+', label: 'Projects Completed', icon: CheckCircle2 },
		{ number: '98%', label: 'Client Satisfaction', icon: CheckCircle2 },
		{ number: '24/7', label: 'Support Available', icon: CheckCircle2 },
		{ number: '15+', label: 'Years Experience', icon: CheckCircle2 },
	];

	return (
		<section ref={ref} id="services" className="py-20 bg-muted/30 relative overflow-hidden">
			{/* Subtle Decorative Background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					className="max-w-6xl mx-auto"
				>
					{/* Section Header */}
					<motion.div variants={itemVariants} className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Our <span className="gradient-text">IT Services</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							<strong>Fujiyama Technology Solutions</strong> offers comprehensive digital
							transformation services designed to help your business succeed in Indonesia's
							competitive landscape. From <strong>custom web development</strong> to{' '}
							<strong>enterprise mobile applications</strong>, we deliver end-to-end IT solutions
							with Japanese quality standards.
						</p>
					</motion.div>

					{/* Stats Section dengan Visual */}
					<motion.div variants={itemVariants} className="mb-16">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2">
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									className="card-gradient p-6 rounded-xl text-center relative overflow-hidden group border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
									whileHover={{ y: -4 }}
									transition={{ duration: 0.3 }}
								>
									{/* Elegant decorative background icon */}
									<div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
										<stat.icon className="w-20 h-20 text-primary" />
									</div>

									<div className="relative z-10">
										<div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
											{stat.number}
										</div>
										<div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Services Grid - Simplified */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2">
						{services.map((service, index) => (
							<motion.div key={index} variants={itemVariants} className="group">
								<motion.div
									className="rounded-xl h-full hover:shadow-md transition-all duration-300 relative overflow-hidden border border-border/50 hover:border-primary/30 bg-card"
									whileHover={{ y: -4 }}
									transition={{ duration: 0.3 }}
								>
									{/* Image Header Section - Simplified */}
									<div className="relative h-48 overflow-hidden">
										{/* Background Image */}
										<img
											src={service.image}
											alt={service.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>

										{/* Consistent Gradient Overlay - Primary Blue */}
										<div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 via-blue-800/80 to-slate-900/85" />

										{/* Content di atas image */}
										<div className="absolute inset-0 flex flex-col justify-between p-6">
											{/* Icon di top-left - Simplified */}
											<div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center">
												<service.icon className="w-6 h-6 text-white" />
											</div>

											{/* Title di bottom dengan backdrop blur */}
											<div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
												<h3 className="text-lg font-bold text-white">{service.title}</h3>
											</div>
										</div>
									</div>

									{/* Content Section */}
									<div className="p-6 space-y-4">
										{/* Description */}
										<p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
											{service.description}
										</p>

										{/* Features - Simplified */}
										<ul className="space-y-2.5">
											{service.features.map((feature, featureIndex) => (
												<li
													key={featureIndex}
													className="flex items-start text-sm text-muted-foreground"
												>
													<CheckCircle2 className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
													<span className="leading-relaxed">{feature}</span>
												</li>
											))}
										</ul>

										{/* CTA Button - Simplified */}
										<Button
											variant="outline"
											className="w-full mt-4"
											onClick={() =>
												document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
											}
										>
											<span className="font-semibold">Learn More</span>
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Bottom CTA - Simplified */}
					<motion.div variants={itemVariants} className="text-center mt-16">
						<div className="card-gradient p-8 rounded-xl max-w-2xl mx-auto border border-border/50">
							<h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
							<p className="text-muted-foreground mb-6">
								We specialize in creating tailored solutions that fit your unique business
								requirements. Let's discuss your project.
							</p>
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90 shadow-md"
								onClick={() =>
									document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
								}
							>
								Start Your Project
							</Button>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Services;
