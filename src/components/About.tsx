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
							About <span className="gradient-text">Our Company</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							We are a forward-thinking technology company dedicated to creating innovative
							solutions that empower businesses to thrive in the digital age.
						</p>
					</motion.div>

					{/* Main Content Grid */}
					<div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
						{/* Left Content */}
						<motion.div variants={itemVariants}>
							<h3 className="text-2xl md:text-3xl font-bold mb-6">
								Transforming Ideas into Reality
							</h3>
							<div className="space-y-4 text-muted-foreground">
								<p>
									Founded with a vision to bridge the gap between innovative technology and
									practical business solutions, we have been at the forefront of digital
									transformation for over a decade.
								</p>
								<p>
									FTS is a Japanese-rooted IT innovator committed to building a digital future for
									Indonesia. With over 95% of our team proudly Indonesian, we combine global
									technology trends with local insight to create advanced digital solutions tailored
									for businesses, government, and society.
								</p>
								<p>
									Our mission is to bridge the gap between innovation and real-world needs
									empowering businesses, enhancing government services, and improving everyday life.
								</p>
							</div>
						</motion.div>

						{/* Right Content - Stats */}
						<motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
							{[
								{ number: '10+', label: 'Years Experience' },
								{ number: '500+', label: 'Projects Delivered' },
								{ number: '50+', label: 'Team Members' },
								{ number: '25+', label: 'Countries Served' },
							].map((stat, index) => (
								<motion.div
									key={index}
									className="card-gradient p-6 rounded-xl text-center"
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
								>
									<div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
									<div className="text-sm text-muted-foreground">{stat.label}</div>
								</motion.div>
							))}
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
