import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { Check, Star, Zap, Rocket, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { convertIdrToUsd, formatIDR, formatUSD } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const Pricing = () => {
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

	// Paket pricing FTS sesuai permintaan dengan konversi IDR->USD di frontend murni
	const plans = [
		{
			name: 'Up to 5 Pages',
			serverFeeIdr: 700000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: false,
			cta: 'Get Started',
			icon: Zap,
			color: 'from-blue-500/20 to-cyan-500/20',
			iconColor: 'text-blue-500',
			bgGlow: 'bg-blue-500/10',
		},
		{
			name: 'Up to 10 Pages',
			serverFeeIdr: 1200000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: true,
			cta: 'Most Popular',
			icon: Rocket,
			color: 'from-purple-500/20 to-pink-500/20',
			iconColor: 'text-purple-500',
			bgGlow: 'bg-purple-500/10',
		},
		{
			name: 'Up to 15 Pages',
			serverFeeIdr: 1600000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: false,
			cta: 'Contact Us',
			icon: Crown,
			color: 'from-amber-500/20 to-orange-500/20',
			iconColor: 'text-amber-500',
			bgGlow: 'bg-amber-500/10',
		},
	];

	// Toggle mata uang: true -> tampil USD, false -> tampil IDR
	const [showUSD, setShowUSD] = useState(false);

	const formatMonthly = useMemo(() => {
		return (idr: number) =>
			showUSD ? `${formatUSD(convertIdrToUsd(idr))} / month` : `${formatIDR(idr)} / month`;
	}, [showUSD]);

	return (
		<section ref={ref} id="pricing" className="py-20 bg-background relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
			</div>

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
							<Sparkles className="w-5 h-5 text-primary" />
							<span className="text-primary font-semibold text-sm uppercase tracking-wider">
								Pricing Plans
							</span>
							<Sparkles className="w-5 h-5 text-primary" />
						</motion.div>

						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							Simple <span className="gradient-text">Pricing</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
							Transparent pricing with no hidden fees. Choose the plan that best fits your project
							needs and budget.
						</p>

						{/* Currency Toggle - Enhanced */}
						<motion.div
							className="inline-flex items-center gap-4 bg-muted/50 dark:bg-muted/30 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50"
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.2 }}
						>
							<span
								className={`text-sm font-medium transition-colors ${
									!showUSD ? 'text-foreground' : 'text-muted-foreground'
								}`}
							>
								IDR
							</span>
							<Switch checked={showUSD} onCheckedChange={setShowUSD} aria-label="Toggle currency" />
							<span
								className={`text-sm font-medium transition-colors ${
									showUSD ? 'text-foreground' : 'text-muted-foreground'
								}`}
							>
								USD
							</span>
						</motion.div>
					</motion.div>

					{/* Pricing Cards - Enhanced Visual Design */}
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 justify-items-center">
						{plans.map((plan, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className="relative group w-full max-w-sm"
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6, delay: index * 0.1 }}
							>
								{/* Popular Badge - Enhanced */}
								{plan.popular && (
									<motion.div
										className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.5, delay: 0.5 }}
									>
										<div className="relative">
											<Badge className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2 rounded-full shadow-lg shadow-primary/30">
												<Star className="w-4 h-4 mr-1.5 fill-current" />
												Most Popular
											</Badge>
											<div className="absolute inset-0 bg-primary/30 rounded-full blur-lg -z-10" />
										</div>
									</motion.div>
								)}

								{/* Card Container */}
								<motion.div
									className={`card-gradient p-8 rounded-2xl h-full transition-all duration-300 relative overflow-hidden border border-border/50 ${
										plan.popular
											? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background shadow-xl shadow-primary/10'
											: 'hover:border-primary/30'
									}`}
									whileHover={{ scale: plan.popular ? 1.03 : 1.02, y: -8 }}
									transition={{ duration: 0.3 }}
								>
									{/* Animated gradient background */}
									<div
										className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
									/>

									{/* Decorative circle glow */}
									<div
										className={`absolute -right-8 -top-8 w-40 h-40 ${plan.bgGlow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}
									/>

									{/* Content */}
									<div className="relative z-10">
										{/* Icon Header */}
										<div className="flex justify-center mb-6">
											<div className="relative">
												<motion.div
													className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
													whileHover={{ rotate: 12 }}
												>
													<plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
												</motion.div>
												{/* Icon glow */}
												<div
													className={`absolute inset-0 ${plan.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300`}
												/>
											</div>
										</div>

										{/* Plan Name */}
										<h3 className="text-2xl font-bold text-center mb-6 group-hover:gradient-text transition-all duration-300">
											{plan.name}
										</h3>

										{/* Pricing Display */}
										{plan.serverFeeIdr !== null ? (
											<div className="text-center mb-8">
												<div className="mb-3">
													<span className="text-4xl font-bold gradient-text">
														{formatMonthly(plan.serverFeeIdr).split(' / ')[0]}
													</span>
													<span className="text-muted-foreground text-lg ml-2">/ month</span>
												</div>
												<div className="inline-flex items-center gap-2 bg-muted/50 dark:bg-muted/30 backdrop-blur-sm rounded-full px-4 py-1.5 border border-border/50">
													<span className="text-xs text-muted-foreground">
														≈{' '}
														{showUSD
															? formatIDR(plan.serverFeeIdr)
															: formatUSD(convertIdrToUsd(plan.serverFeeIdr))}{' '}
														/ month
													</span>
												</div>
											</div>
										) : (
											<p className="text-muted-foreground text-sm text-center mb-8">
												Quotation available upon request
											</p>
										)}

										{/* Features List */}
										<ul className="space-y-4 mb-8">
											{plan.serverFeeIdr !== null ? (
												<>
													<li className="flex items-start group/item">
														<div className="relative">
															<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
														</div>
														<span className="text-sm leading-relaxed">
															Website design & development:{' '}
															<span className="font-semibold text-primary">FREE</span>
														</span>
													</li>
													<li className="flex items-start group/item">
														<div className="relative">
															<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
														</div>
														<span className="text-sm leading-relaxed">
															Server fee: {formatMonthly(plan.serverFeeIdr)} (≈{' '}
															{showUSD
																? formatIDR(plan.serverFeeIdr)
																: formatUSD(convertIdrToUsd(plan.serverFeeIdr))}{' '}
															/ month) {plan.contractNote}
														</span>
													</li>
												</>
											) : (
												<li className="flex items-start group/item">
													<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
													<span className="text-sm leading-relaxed">
														Quotation available upon request
													</span>
												</li>
											)}
										</ul>

										{/* CTA Button */}
										<Button
											className={`w-full group/btn ${
												plan.popular
													? 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/30'
													: 'hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white'
											}`}
											variant={plan.popular ? 'default' : 'outline'}
											size="lg"
											onClick={() =>
												document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
											}
										>
											<span className="font-semibold">{plan.cta}</span>
											{plan.popular && (
												<Star className="w-4 h-4 ml-2 group-hover/btn:rotate-12 transition-transform fill-current" />
											)}
										</Button>
									</div>

									{/* Bottom accent line */}
									<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* More than 15 Pages - Enhanced Visual Design */}
					<motion.div
						variants={itemVariants}
						className="relative group"
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.3 }}
					>
						<div className="card-gradient p-10 sm:p-12 rounded-2xl max-w-3xl mx-auto relative overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300">
							{/* Decorative background gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

							{/* Decorative circles */}
							<div className="absolute -left-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
							<div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

							{/* Content */}
							<div className="relative z-10 text-center">
								{/* Icon */}
								<div className="flex justify-center mb-6">
									<div className="relative">
										<motion.div
											className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg"
											whileHover={{ rotate: 12 }}
										>
											<Crown className="w-10 h-10 text-primary" />
										</motion.div>
										{/* Icon glow */}
										<div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
									</div>
								</div>

								<h3 className="text-3xl sm:text-4xl font-bold mb-4 group-hover:gradient-text transition-all duration-300">
									More than 15 Pages
								</h3>
								<p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
									Quotation available upon request. Kami akan menyesuaikan scope, fitur, dan
									timeline sesuai kebutuhan Anda.
								</p>

								{/* CTA Buttons */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button
										variant="outline"
										size="lg"
										className="group/btn hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white hover:border-primary transition-all duration-300"
										onClick={() =>
											document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
										}
									>
										<Sparkles className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
										<span className="font-semibold">Request Quote</span>
									</Button>
									<Button
										size="lg"
										className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/30 group/btn"
										onClick={() =>
											document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
										}
									>
										<span className="font-semibold">Discuss Requirements</span>
										<Rocket className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
									</Button>
								</div>
							</div>

							{/* Bottom accent line */}
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Pricing;
