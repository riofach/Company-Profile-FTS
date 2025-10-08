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
			gradient: 'from-blue-600/70 via-blue-800/80 to-slate-900/85',
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
			gradient: 'from-purple-600/70 via-purple-800/80 to-slate-900/85',
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
			gradient: 'from-cyan-600/70 via-cyan-800/80 to-slate-900/85',
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
			gradient: 'from-red-600/70 via-red-800/80 to-slate-900/85',
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
			gradient: 'from-amber-600/70 via-orange-800/80 to-slate-900/85',
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
			gradient: 'from-green-600/70 via-emerald-800/80 to-slate-900/85',
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
			{/* Decorative Background Elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									className="card-gradient p-6 rounded-xl text-center relative overflow-hidden group"
									whileHover={{ scale: 1.05, y: -5 }}
									transition={{ duration: 0.3 }}
								>
									{/* Decorative background icon */}
									<div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
										<stat.icon className="w-24 h-24 text-primary" />
									</div>

									<div className="relative z-10">
										<div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
											{stat.number}
										</div>
										<div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
									</div>

									{/* Animated border */}
									<div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-xl transition-colors" />
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Services Grid dengan Image Integration */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<motion.div key={index} variants={itemVariants} className="group">
								<motion.div
									className="rounded-xl h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden border border-border/50 group-hover:border-primary/30 bg-card"
									whileHover={{ scale: 1.02, y: -5 }}
									transition={{ duration: 0.3 }}
								>
									{/* Image Header Section dengan Gradient Overlay */}
									<div className="relative h-48 overflow-hidden">
										{/* Background Image */}
										<img
											src={service.image}
											alt={service.title}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>

										{/* Gradient Overlay untuk readability (support light/dark mode) */}
										<div
											className={`absolute inset-0 bg-gradient-to-b ${service.gradient} dark:${service.gradient}`}
										/>

										{/* Content di atas image */}
										<div className="absolute inset-0 flex flex-col justify-between p-6">
											{/* Icon di top-left dengan glass effect */}
											<div className="relative w-fit">
												<motion.div
													className="inline-flex items-center justify-center w-14 h-14 bg-white/10 dark:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
													whileHover={{ rotate: 12 }}
												>
													<service.icon className="w-7 h-7 text-white" />
												</motion.div>
												{/* Icon glow effect */}
												<div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
											</div>

											{/* Title di bottom dengan backdrop blur */}
											<div className="bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10">
												<h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
													{service.title}
												</h3>
											</div>
										</div>

										{/* Decorative gradient beam effect */}
										<div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 group-hover:via-white/10 transition-colors duration-500" />
									</div>

									{/* Content Section */}
									<div className="p-6 space-y-4">
										{/* Description */}
										<p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
											{service.description}
										</p>

										{/* Features dengan enhanced bullets */}
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

										{/* CTA Button dengan icon dan gradient */}
										<Button
											variant="outline"
											className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 group-hover:text-white group-hover:border-primary transition-all duration-300 group/btn mt-4"
											onClick={() =>
												document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
											}
										>
											<span className="font-semibold">Learn More</span>
											<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
										</Button>
									</div>

									{/* Bottom decorative gradient line */}
									<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Bottom CTA */}
					<motion.div variants={itemVariants} className="text-center mt-16">
						<div className="card-gradient p-8 rounded-xl max-w-2xl mx-auto">
							<h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
							<p className="text-muted-foreground mb-6">
								We specialize in creating tailored solutions that fit your unique business
								requirements. Let's discuss your project.
							</p>
							<Button
								size="lg"
								className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
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
