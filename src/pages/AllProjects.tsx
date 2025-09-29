import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME, LOGO_SRC } from '@/lib/brand';

const AllProjects = () => {
	const allProjects = [
		{
			title: 'Tire Reservation',
			description:
				'Advanced tire reservation and inventory management system with real-time availability tracking and automated booking processes. Features comprehensive tire catalog, customer management, and seamless reservation workflow.',
			image: '/images/projects/tire.png',
			tags: ['Laravel', 'PostgreSQL', 'Reservation'],
			liveUrl: 'https://tires.fts.biz.id',
			githubUrl: '#',
		},
		{
			title: 'Building Maintenance',
			description:
				'Comprehensive building maintenance management system with work order tracking, preventive maintenance scheduling, and facility management. Includes asset tracking, maintenance history, and automated reporting for building operations.',
			image: '/images/projects/bill-maintenance.png',
			tags: ['Laravel', 'MySQL', 'Building', 'Maintenance'],
			liveUrl: 'https://bill-maintenance.fts.biz.id',
			githubUrl: '#',
		},
		{
			title: 'Car Repair Shop',
			description:
				'Complete car repair shop management system with appointment scheduling, service tracking, inventory management, and customer relationship management. Features repair history, billing integration, and workshop workflow optimization.',
			image: '/images/projects/car-repair.png',
			tags: ['Laravel', 'MySQL', 'Car Repair', 'Shop'],
			liveUrl: 'https://car-repair.fts.biz.id',
			githubUrl: '#',
		},
		{
			title: 'Ebilahall',
			description:
				'Comprehensive event hall management system with booking management, event scheduling, capacity planning, and facility coordination. Features event calendar, customer management, and automated booking confirmations for hall operations.',
			image: '/images/projects/ebilahall.png',
			tags: ['Laravel', 'MySQL', 'Hall', 'Event'],
			liveUrl: 'https://ebilahall.fts.biz.id',
			githubUrl: '#',
		},
	];

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

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="flex items-center space-x-3">
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
						</Link>
						<div className="flex items-center space-x-4">
							<Button variant="outline" asChild>
								<Link to="/projects" className="flex items-center space-x-2">
									<ArrowLeft className="w-4 h-4" />
									<span>Latest Projects</span>
								</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link to="/" className="flex items-center space-x-2">
									<ArrowLeft className="w-4 h-4" />
									<span>Back to Home</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-4xl mx-auto px-4"
					>
						<h1 className="text-5xl md:text-6xl font-bold mb-6">
							All <span className="gradient-text">Projects</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 leading-relaxed">
							Complete showcase of our innovative digital solutions across{' '}
							<strong>web design</strong>,<strong>custom development</strong>, and{' '}
							<strong>mobile applications</strong>. Explore our full portfolio of successful
							projects that demonstrate <strong>Fujiyama Technology Solutions</strong>' expertise in
							transforming ideas into exceptional digital products.
						</p>
						<div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
							<span>Total Projects: {allProjects.length}</span>
							<span>•</span>
							<Link to="/projects" className="text-primary hover:underline">
								View Latest 3 Projects
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* All Projects Grid */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="container mx-auto px-4 pb-20"
			>
				{/* Projects Grid */}
				<motion.section variants={itemVariants} className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Project Portfolio</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Explore all our web development projects showcasing modern technologies and innovative
							solutions
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{allProjects.map((project, projectIndex) => (
							<motion.div
								key={projectIndex}
								variants={itemVariants}
								whileHover={{ y: -5 }}
								transition={{ duration: 0.3 }}
							>
								<Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
									<div className="relative overflow-hidden">
										<img
											src={project.image}
											alt={project.title}
											className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<Button
												size="sm"
												variant="secondary"
												className="h-8 w-8 p-0"
												onClick={(e) => {
													e.stopPropagation();
													if (project.liveUrl && project.liveUrl !== '#') {
														window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
													}
												}}
												title="View Live Demo"
											>
												<ExternalLink className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												variant="secondary"
												className="h-8 w-8 p-0"
												onClick={(e) => {
													e.stopPropagation();
													if (project.githubUrl && project.githubUrl !== '#') {
														window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
													}
												}}
												title="View Source Code"
											>
												<Github className="w-4 h-4" />
											</Button>
										</div>
									</div>
									<div className="p-6 flex flex-col h-full">
										<h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
											{project.title}
										</h3>
										<p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
											{project.description}
										</p>
										<div className="flex flex-wrap gap-2 mt-auto">
											{project.tags.map((tag, tagIndex) => (
												<Badge key={tagIndex} variant="secondary" className="text-xs">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* CTA Section */}
				<motion.section variants={itemVariants} className="text-center py-16">
					<div className="card-gradient p-12 rounded-2xl max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
						<p className="text-lg text-muted-foreground mb-8">
							Let's discuss how we can bring your vision to life with cutting-edge technology and
							innovative design.
						</p>
						<Button
							size="lg"
							asChild
							className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
						>
							<Link to="/#contact">Get Started Today</Link>
						</Button>
					</div>
				</motion.section>
			</motion.div>
		</div>
	);
};

export default AllProjects;
