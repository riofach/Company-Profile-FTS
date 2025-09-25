import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useEffect } from 'react';

const Hero = () => {
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

	// Aurora background state
	const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];
	const color = useMotionValue(COLORS_TOP[0]);
	useEffect(() => {
		animate(color, COLORS_TOP, {
			ease: 'easeInOut',
			duration: 10,
			repeat: Infinity,
			repeatType: 'mirror',
		});
	}, []);
	const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

	return (
		<motion.section
			id="home"
			style={{ backgroundImage }}
			className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 pt-10 md:pt-24"
		>
			{/* 3D Stars Background */}
			<div className="absolute inset-0 z-0">
				<Canvas>
					<Stars radius={50} count={2500} factor={4} fade speed={2} />
				</Canvas>
			</div>

			{/* Content */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 text-center max-w-5xl mx-auto px-6 md:px-8"
			>
				<motion.div
					variants={itemVariants}
					className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 md:px-6 md:py-2 mb-8 mt-8 md:mt-0"
				>
					<Sparkles className="w-4 h-4 text-white" />
					<span className="text-white text-sm font-medium">Innovating the Future</span>
				</motion.div>

				<motion.h1
					variants={itemVariants}
					className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight px-2"
				>
					Building Tomorrow's
					<span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
						Digital Solutions
					</span>
				</motion.h1>

				<motion.p
					variants={itemVariants}
					className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed px-4"
				>
					We transform ideas into powerful digital experiences that drive growth and innovation for
					businesses worldwide. As a leading <strong>IT services company in Indonesia</strong> with
					Japanese technology expertise, we deliver cutting-edge web development, mobile
					applications, cloud solutions, and cybersecurity services.
				</motion.p>

				<motion.div
					variants={itemVariants}
					className="flex flex-col sm:flex-row gap-4 justify-center items-center"
				>
					<Button
						size="lg"
						className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 rounded-full group"
						onClick={() =>
							document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
						}
					>
						Get Started
						<ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
					</Button>

					<Button
						variant="outline"
						size="lg"
						className="text-lg px-8 py-3 rounded-full backdrop-blur-sm border-black/20 text-black hover:bg-black/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
						onClick={() => (window.location.href = '/projects')}
					>
						Our Projects
					</Button>
				</motion.div>

				{/* Stats */}
				<motion.div
					variants={itemVariants}
					className="grid grid-cols-3 gap-8 mt-10 pb-5 max-w-md mx-auto"
				>
					{[
						{ number: '500+', label: 'Projects Completed' },
						{ number: '99%', label: 'Client Satisfaction' },
						{ number: '24/7', label: 'Support Available' },
					].map((stat, index) => (
						<div key={index} className="text-center">
							<div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
							<div className="text-sm text-white/70">{stat.label}</div>
						</div>
					))}
				</motion.div>
			</motion.div>

			{/* Scroll Indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
			>
				<div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
					<div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
				</div>
			</motion.div>
		</motion.section>
	);
};

export default Hero;
