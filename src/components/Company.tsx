import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
	MapPin,
	Mail,
	Linkedin,
	Github,
	Twitter,
	Target,
	Award,
	TrendingUp,
	Lightbulb,
	Sparkles,
	Phone,
	Building2,
	Clock,
	ArrowRight,
	Users,
	Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Company = () => {
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

	// Executive Team (CEO & COO)
	const executives = [
		{
			name: 'Yoshihiro Nakagawa',
			role: 'Chief Executive Officer',
			image: './images/yoshi.webp',
			bio: 'With over 20 years of leadership experience in the technology sector, Yoshihiro is the visionary force behind FTS. He is dedicated to driving digital transformation in Indonesia by combining global innovation with deep local insight.',
			social: { linkedin: '#', twitter: '#' },
		},
		{
			name: 'Azmi Roza',
			role: 'Chief Operating Officer',
			image: './images/azmi.webp',
			bio: "Azmi leads the company's day-to-day operations with a sharp focus on excellence and efficiency. He is an expert in building high-performing teams and ensuring the successful delivery of our projects, guaranteeing client satisfaction.",
			social: { linkedin: '#', github: '#' },
		},
	];

	// Director Team
	const directors = [
		{
			name: 'Naoki Yoshida',
			role: 'Director',
			image: './images/naoki.webp',
			bio: 'As a Director, Naoki oversees our technology and innovation strategy. He has a keen eye for emerging trends and is passionate about developing cutting-edge solutions that solve real-world problems for our clients.',
			social: { linkedin: '#', twitter: '#' },
		},
		{
			name: 'Takaki Morita',
			role: 'Director',
			image: './images/takaki.webp',
			bio: 'Takaki is responsible for driving our business development and strategic partnerships. He focuses on building strong, long-term relationships with clients, identifying new market opportunities for the continued growth of FTS.',
			social: { linkedin: '#', github: '#' },
		},
		{
			name: 'Takakazu Kaburaki',
			role: 'Director',
			image: './images/takakazu.webp',
			bio: 'Takakazu leads our project management and delivery teams. With a background in large-scale IT implementations, he ensures that our projects are executed flawlessly, on time, and within budget.',
			social: { linkedin: '#', github: '#' },
		},
	];

	// Company values - Simplified with consistent theme
	const values = [
		{
			icon: Lightbulb,
			title: 'Innovation',
			description:
				'We embrace cutting-edge technologies and creative solutions to solve complex challenges.',
		},
		{
			icon: Award,
			title: 'Quality',
			description:
				'Every project is delivered with meticulous attention to detail and the highest standards.',
		},
		{
			icon: Target,
			title: 'Transparency',
			description:
				'Open communication and honest partnerships are the foundation of our relationships.',
		},
		{
			icon: TrendingUp,
			title: 'Growth',
			description:
				"We're committed to continuous learning and helping our clients achieve sustainable growth.",
		},
	];

	return (
		<section ref={ref} id="company" className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					className="max-w-6xl mx-auto"
				>
					{/* Section Header - Enhanced */}
					<motion.div variants={itemVariants} className="text-center mb-16 relative">
						{/* Top Badge */}
						<motion.div
							className="inline-flex items-center gap-2 mb-6"
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6 }}
						>
							<Users className="w-5 h-5 text-primary" />
							<span className="text-primary font-semibold text-sm uppercase tracking-wider">
								Our Team
							</span>
							<Users className="w-5 h-5 text-primary" />
						</motion.div>

						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Meet Our <span className="gradient-text">Team</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Our diverse team of experts brings together years of experience and a passion for
							creating exceptional digital solutions.
						</p>
					</motion.div>

					{/* Executive Team Section - Enhanced */}
					<motion.div variants={itemVariants} className="mb-20 relative">
						{/* Decorative background */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
							<div className="absolute bottom-0 right-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
						</div>

						{/* Section Header */}
						<motion.div
							className="text-center mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="inline-flex items-center gap-2 mb-4">
								<Shield className="w-5 h-5 text-primary" />
								<h3 className="text-2xl md:text-3xl font-bold">
									Executive <span className="gradient-text">Leadership</span>
								</h3>
								<Shield className="w-5 h-5 text-primary" />
							</div>
							<p className="text-sm text-muted-foreground">
								Visionary leaders driving innovation and excellence
							</p>
						</motion.div>

						<div className="grid md:grid-cols-2 gap-8">
							{executives.map((member, index) => (
								<motion.div
									key={index}
									className="group relative"
									initial={{ opacity: 0, y: 30 }}
									animate={isInView ? { opacity: 1, y: 0 } : {}}
									transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
									whileHover={{ scale: 1.03, y: -8 }}
								>
									<div className="card-gradient p-8 rounded-2xl text-center relative overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all duration-300 h-full">
										{/* Decorative gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										{/* Decorative glow circles */}
										<div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

										{/* Content */}
										<div className="relative z-10">
											{/* Profile Image - Enhanced */}
											<div className="relative mb-6">
												<div className="relative inline-block">
													{/* Image container */}
													<div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/20">
														<img
															src={member.image}
															alt={member.name}
															className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
														/>
													</div>
													{/* Glow effect */}
													<div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
												</div>

												{/* Executive badge */}
												<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
													<div className="bg-gradient-to-r from-primary to-primary-light text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
														Executive
													</div>
												</div>
											</div>

											{/* Member Info */}
											<h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300">
												{member.name}
											</h3>
											<p className="text-primary text-sm font-semibold mb-4 uppercase tracking-wide">
												{member.role}
											</p>
											<p className="text-muted-foreground text-sm mb-6 leading-relaxed">
												{member.bio}
											</p>

											{/* Social Links - Enhanced */}
											<div className="flex justify-center gap-3">
												{member.social.linkedin && (
													<a href={member.social.linkedin} className="group/social relative">
														<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Linkedin className="w-5 h-5 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
												{member.social.github && (
													<a href={member.social.github} className="group/social relative">
														<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Github className="w-5 h-5 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
												{member.social.twitter && (
													<a href={member.social.twitter} className="group/social relative">
														<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Twitter className="w-5 h-5 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
											</div>
										</div>

										{/* Bottom accent line */}
										<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Directors Team Section - Enhanced */}
					<motion.div variants={itemVariants} className="relative">
						{/* Decorative background */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute top-1/2 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
							<div className="absolute top-1/2 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
						</div>

						{/* Section Header */}
						<motion.div
							className="text-center mb-12"
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.5 }}
						>
							<div className="inline-flex items-center gap-2 mb-4">
								<Users className="w-5 h-5 text-primary" />
								<h3 className="text-2xl md:text-3xl font-bold">
									Our <span className="gradient-text">Directors</span>
								</h3>
								<Users className="w-5 h-5 text-primary" />
							</div>
							<p className="text-sm text-muted-foreground">
								Strategic minds shaping our company's future
							</p>
						</motion.div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
							{directors.map((member, index) => (
								<motion.div
									key={index}
									className="group relative"
									initial={{ opacity: 0, y: 30 }}
									animate={isInView ? { opacity: 1, y: 0 } : {}}
									transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
									whileHover={{ scale: 1.05, y: -8 }}
								>
									<div className="card-gradient p-6 rounded-2xl text-center relative overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all duration-300 h-full">
										{/* Decorative gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										{/* Decorative glow circle */}
										<div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

										{/* Content */}
										<div className="relative z-10">
											{/* Profile Image - Enhanced */}
											<div className="relative mb-5">
												<div className="relative inline-block">
													{/* Image container */}
													<div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20">
														<img
															src={member.image}
															alt={member.name}
															className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
														/>
													</div>
													{/* Glow effect */}
													<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
												</div>

												{/* Director badge */}
												<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
													<div className="bg-gradient-to-r from-primary/80 to-primary-light/80 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
														Director
													</div>
												</div>
											</div>

											{/* Member Info */}
											<h3 className="text-lg font-bold mb-2 group-hover:gradient-text transition-all duration-300">
												{member.name}
											</h3>
											<p className="text-primary text-xs font-semibold mb-3 uppercase tracking-wide">
												{member.role}
											</p>
											<p className="text-muted-foreground text-sm mb-5 leading-relaxed line-clamp-4">
												{member.bio}
											</p>

											{/* Social Links - Enhanced */}
											<div className="flex justify-center gap-2">
												{member.social.linkedin && (
													<a href={member.social.linkedin} className="group/social relative">
														<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Linkedin className="w-4 h-4 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
												{member.social.github && (
													<a href={member.social.github} className="group/social relative">
														<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Github className="w-4 h-4 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
												{member.social.twitter && (
													<a href={member.social.twitter} className="group/social relative">
														<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-primary-light transition-all duration-300 group-hover/social:scale-110 group-hover/social:rotate-6">
															<Twitter className="w-4 h-4 text-primary group-hover/social:text-white transition-colors" />
														</div>
														<div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover/social:opacity-50 transition-opacity" />
													</a>
												)}
											</div>
										</div>

										{/* Bottom accent line */}
										<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Company Values - Simplified */}
					<motion.div variants={itemVariants} className="mt-20 relative">
						{/* Subtle decorative background */}
						<div className="absolute inset-0 -z-10">
							<div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
							<div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
						</div>

						{/* Section Header - Simplified */}
						<div className="text-center mb-12 relative">
							<motion.div
								className="inline-flex items-center gap-2 mb-4"
								initial={{ opacity: 0, y: 20 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6 }}
							>
								<Sparkles className="w-5 h-5 text-primary" />
								<span className="text-primary font-semibold text-sm uppercase tracking-wider">
									What Drives Us
								</span>
								<Sparkles className="w-5 h-5 text-primary" />
							</motion.div>
							<h3 className="text-3xl md:text-4xl font-bold">
								Our <span className="gradient-text">Core Values</span>
							</h3>
							<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
								These fundamental principles guide every decision we make and every project we
								deliver
							</p>
						</div>

						{/* Values Grid - Simplified */}
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
							{values.map((value, index) => (
								<motion.div
									key={index}
									className="group relative"
									initial={{ opacity: 0, y: 30 }}
									animate={isInView ? { opacity: 1, y: 0 } : {}}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									whileHover={{ y: -4 }}
								>
									{/* Card - Simplified */}
									<div className="card-gradient p-6 rounded-2xl text-center relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
										{/* Content */}
										<div className="relative z-10">
											{/* Icon Container - Simplified */}
											<div className="inline-block mb-4">
												<div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-primary/15">
													<value.icon className="w-7 h-7 text-primary" />
												</div>
											</div>

											{/* Title */}
											<h4 className="text-lg font-bold mb-3">{value.title}</h4>

											{/* Description */}
											<p className="text-muted-foreground text-sm leading-relaxed">
												{value.description}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Visit Our Office - Simplified Location Showcase */}
					<motion.div variants={itemVariants} className="mt-20 relative">
						{/* Decorative background elements */}
						<div className="absolute inset-0 -z-10 overflow-hidden">
							<div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
							<div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
						</div>

						{/* Section Header */}
						<div className="text-center mb-12 relative">
							<motion.div
								className="inline-flex items-center gap-2 mb-4"
								initial={{ opacity: 0, y: 20 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6 }}
							>
								<Building2 className="w-5 h-5 text-primary" />
								<span className="text-primary font-semibold text-sm uppercase tracking-wider">
									Our Location
								</span>
								<Building2 className="w-5 h-5 text-primary" />
							</motion.div>
							<h3 className="text-3xl md:text-4xl font-bold mb-4">
								Visit Our <span className="gradient-text">Office</span>
							</h3>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Experience Japanese precision and Indonesian hospitality at our modern office in the
								heart of Jakarta
							</p>
						</div>

						{/* Office Showcase Card */}
						<motion.div
							className="rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
							whileHover={{ y: -5 }}
							transition={{ duration: 0.3 }}
						>
							{/* Hero Image dengan Office Building */}
							<div className="relative h-[32rem] sm:h-[36rem] md:h-[28rem] overflow-hidden group">
								{/* Background Image */}
								<motion.img
									src="./images/neosoho.webp"
									alt="FTS Office - Neo Soho Jakarta"
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>

								{/* Gradient Overlay - Stronger untuk better readability */}
								<div className="absolute inset-0 bg-gradient-to-b from-blue-900/75 via-slate-900/85 to-slate-900/95" />

								{/* Content Over Image dengan Better Spacing */}
								<div className="absolute inset-0 flex flex-col p-5 sm:p-8 md:p-12">
									{/* Top Badge */}
									<div className="flex justify-start pt-2 mb-auto">
										<motion.div
											className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 sm:px-5 sm:py-2.5 border border-white/20 shadow-xl"
											whileHover={{ scale: 1.05 }}
											transition={{ duration: 0.3 }}
										>
											<Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
											<span className="text-white text-xs sm:text-sm font-semibold">
												Jakarta Headquarters
											</span>
										</motion.div>
									</div>

									{/* Bottom Content dengan Closer Spacing to Badge on Mobile */}
									<div className="max-w-3xl pb-2 mt-auto sm:mt-0">
										<motion.h4
											className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.2 }}
										>
											Fujiyama Technology Solutions
										</motion.h4>

										<motion.div
											className="flex items-start gap-2.5 sm:gap-3 text-white/90 mb-5 sm:mb-6"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.3 }}
										>
											<MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 sm:mt-1 flex-shrink-0" />
											<p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
												Neo Soho Mall, Jalan Let. Jend. S. Parman Kav. 28 Unit 2011
												<br className="hidden xs:block" />
												<span className="xs:hidden">, </span>
												Tanjung Duren Selatan, Grogol Petamburan
												<br className="hidden xs:block" />
												<span className="xs:hidden">, </span>
												West Jakarta, DKI Jakarta 11470, Indonesia
											</p>
										</motion.div>

										{/* Quick Info Pills dengan Better Spacing */}
										<motion.div
											className="flex flex-col sm:flex-row gap-2 sm:gap-3"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.4 }}
										>
											<div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20">
												<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
												<span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
													Mon-Fri: 9 AM - 6 PM
												</span>
											</div>
											<div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20">
												<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
												<span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
													+62 895 2933 6179
												</span>
											</div>
										</motion.div>
									</div>
								</div>

								{/* Decorative beam effects */}
								<div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</div>

							{/* Action Bar dengan Better Mobile Layout */}
							<div className="card-gradient p-5 sm:p-6 md:p-8">
								<div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
									{/* Info Text dengan Better Spacing */}
									<div className="text-center sm:text-left w-full sm:w-auto">
										<h5 className="font-bold text-base sm:text-lg mb-2">
											Ready to Start Your Project?
										</h5>
										<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
											Visit us or send a message to discuss your digital transformation needs
										</p>
									</div>

									{/* CTA Buttons dengan Better Mobile Layout */}
									<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-shrink-0">
										<Button
											variant="outline"
											className="group w-full sm:w-auto"
											onClick={() =>
												window.open('https://maps.google.com/?q=Neo+Soho+Jakarta', '_blank')
											}
										>
											<MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
											<span>View Map</span>
										</Button>
										<Button
											className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary group w-full sm:w-auto"
											onClick={() =>
												document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
											}
										>
											<Mail className="w-4 h-4 mr-2" />
											<span>Contact Us</span>
											<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
										</Button>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Trust Indicators dengan Better Mobile Spacing */}
						<motion.div
							className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2"
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.5 }}
						>
							{[
								{ icon: Building2, label: 'Prime Location', desc: 'Neo Soho Mall' },
								{ icon: Clock, label: 'Easy Access', desc: 'Central Jakarta' },
								{ icon: MapPin, label: 'Strategic Hub', desc: 'Business District' },
								{ icon: Sparkles, label: 'Modern Office', desc: 'Full Facilities' },
							].map((item, index) => (
								<motion.div
									key={index}
									className="card-gradient p-3 sm:p-4 rounded-xl text-center border border-border/50 hover:border-primary/30 transition-all duration-300 group"
									whileHover={{ scale: 1.05, y: -5 }}
								>
									<div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
										<item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
									</div>
									<h6 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{item.label}</h6>
									<p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
										{item.desc}
									</p>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Company;
