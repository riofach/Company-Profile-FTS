import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
	ArrowRight,
	Sparkles,
	Code2,
	Smartphone,
	Cloud,
	Shield,
	Zap,
	TrendingUp,
} from 'lucide-react';
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

	// Quick features untuk showcase
	const quickFeatures = [
		{ icon: Code2, label: 'Web Development', color: 'from-blue-500 to-cyan-500' },
		{ icon: Smartphone, label: 'Mobile Apps', color: 'from-purple-500 to-pink-500' },
		{ icon: Cloud, label: 'Cloud Solutions', color: 'from-cyan-500 to-blue-500' },
		{ icon: Shield, label: 'Cybersecurity', color: 'from-red-500 to-orange-500' },
		{ icon: Zap, label: 'Performance', color: 'from-amber-500 to-yellow-500' },
		{ icon: TrendingUp, label: 'Digital Growth', color: 'from-green-500 to-emerald-500' },
	];

	// Stats untuk showcase
	// const stats = [
	// 	{ number: '50+', label: 'Projects', sublabel: 'Completed' },
	// 	{ number: '98%', label: 'Client', sublabel: 'Satisfaction' },
	// 	{ number: '24/7', label: 'Support', sublabel: 'Available' },
	// 	{ number: '15+', label: 'Years', sublabel: 'Experience' },
	// ];

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

			{/* Content - Enhanced Design */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
			>
				{/* Badge dengan enhanced styling */}
				<motion.div
					variants={itemVariants}
					className="flex justify-center mb-6 sm:mb-8 mt-8 md:mt-0"
				>
					<div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-xl shadow-white/10">
						<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
						<span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
							🇯🇵 Japanese Quality • 🇮🇩 Indonesian Excellence
						</span>
						<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
					</div>
				</motion.div>

				{/* Main Headline - More Powerful */}
				<motion.h1
					variants={itemVariants}
					className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
				>
					<span className="block mb-2">Transforming Ideas Into</span>
					<span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
						Powerful Digital Solutions
					</span>
				</motion.h1>

				{/* Subtitle - More Compelling */}
				<motion.p
					variants={itemVariants}
					className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4"
				>
					Your trusted technology partner combining{' '}
					<span className="text-white font-semibold">Japanese precision</span> and{' '}
					<span className="text-white font-semibold">Indonesian creativity</span> to deliver
					world-class IT solutions for businesses across Indonesia
				</motion.p>

				{/* Quick Features Grid - Visual Showcase */}
				<motion.div
					variants={itemVariants}
					className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-4xl mx-auto"
				>
					{quickFeatures.map((feature, index) => (
						<motion.div
							key={index}
							className="group relative"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
							whileHover={{ scale: 1.1, y: -5 }}
						>
							<div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300">
								{/* Gradient background on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300`}
								/>

								{/* Icon */}
								<div className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2">
									<feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
									<span className="text-[10px] sm:text-xs text-white/80 font-medium text-center leading-tight">
										{feature.label}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Buttons - Enhanced */}
				<motion.div
					variants={itemVariants}
					className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12"
				>
					<Button
						size="lg"
						className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-full group shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 font-semibold"
						onClick={() =>
							document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
						}
					>
						Start Your Project
						<ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-2" />
					</Button>

					<Button
						variant="outline"
						size="lg"
						className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-full backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-semibold"
						onClick={() => (window.location.href = '/projects')}
					>
						View Portfolio
					</Button>
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
