import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });

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

	const features = [
		{
			icon: Award,
			title: 'Excellence',
			description:
				'Committed to delivering the highest quality solutions that exceed expectations.',
		},
		{
			icon: Users,
			title: 'Collaboration',
			description: 'Working closely with our clients to understand their unique needs and goals.',
		},
		{
			icon: Target,
			title: 'Results-Driven',
			description: 'Focused on achieving measurable outcomes that drive business success.',
		},
		{
			icon: Lightbulb,
			title: 'Innovation',
			description: 'Constantly exploring new technologies and approaches to stay ahead.',
		},
	];

	return (
		<section ref={ref} id="about" className="py-20 bg-background">
			<div className="container mx-auto px-4">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					className="max-w-6xl mx-auto"
				>
					{/* Section Header */}
					<motion.div variants={itemVariants} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							About <span className="gradient-text">FTS</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							<strong>Fujiyama Technology Solutions (FTS)</strong> is a{' '}
							<strong>Japanese-rooted IT company</strong> committed to building Indonesia's digital
							future. With over 95% of our team proudly Indonesian, we combine global technology
							trends with local market insight to create advanced digital solutions tailored for
							businesses, government, and society across the archipelago.
						</p>
					</motion.div>

					{/* Main Content Grid */}
					<div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
						{/* Left Content */}
						<motion.div variants={itemVariants}>
							<h3 className="text-2xl md:text-3xl font-bold mb-6">
								Empowering Digital Transformation
							</h3>
							<div className="space-y-4 text-muted-foreground leading-relaxed">
								<p>
									Founded in <strong>February 2025</strong>,{' '}
									<strong>Fujiyama Technology Solutions (FTS)</strong> was established with a vision
									to bridge the gap between technological innovation and practical business
									solutions. We are a <strong>Japanese IT company in Indonesia</strong> that is
									ready to drive digital transformation through our core expertise in{' '}
									<strong>web development</strong>, <strong>mobile applications</strong>,{' '}
									<strong>cloud solutions</strong>, and <strong>cybersecurity services</strong>.
								</p>
								<p>
									We combine Japanese precision and quality standards with a deep understanding of
									local market dynamics, thanks to our team that is 95% Indonesian. Our
									specializations include custom software development, enterprise applications, and
									tailored digital transformation strategies specifically designed for the
									Indonesian market. FTS is committed to providing solutions that are not only
									technologically advanced but also culturally relevant and optimized for businesses
									across Indonesia, including Jakarta, Surabaya, and Bandung.
								</p>
							</div>
						</motion.div>

						{/* Right Content - Logo */}
						<motion.div
							variants={itemVariants}
							className="flex items-center justify-center"
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
						>
							<div className="relative group">
								{/* Logo Container dengan theme-aware background */}
								<div className="card-gradient p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
									{/* Logo Image */}
									<img
										src="/Logo FTS.jpg"
										alt="Fujiyama Technology Solutions Logo"
										className="w-full h-auto max-w-sm mx-auto rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
										loading="eager"
									/>
								</div>

								{/* Subtle glow effect untuk dark mode */}
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5 -z-10 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
							</div>
						</motion.div>
					</div>

					{/* Features Grid */}
					<motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className="card-gradient p-6 rounded-xl text-center group"
								whileHover={{ scale: 1.05, y: -5 }}
								transition={{ duration: 0.3 }}
							>
								<div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
									<feature.icon className="w-6 h-6 text-primary" />
								</div>
								<h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
								<p className="text-sm text-muted-foreground">{feature.description}</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default About;
