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
		},
		{
			name: 'Up to 10 Pages',
			serverFeeIdr: 1200000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: true,
			cta: 'Most Popular',
			icon: Rocket,
		},
		{
			name: 'Up to 15 Pages',
			serverFeeIdr: 1600000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: false,
			cta: 'Contact Us',
			icon: Crown,
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
			{/* Subtle decorative background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
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
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 justify-items-center px-2">
						{plans.map((plan, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className="relative group w-full max-w-sm"
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6, delay: index * 0.1 }}
							>
								{/* Popular Badge - Simplified */}
								{plan.popular && (
									<motion.div
										className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.3 }}
									>
										<Badge className="bg-primary text-white px-4 py-1.5 rounded-full shadow-md">
											<Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
											Most Popular
										</Badge>
									</motion.div>
								)}

								{/* Card Container */}
								<motion.div
									className={`card-gradient p-8 rounded-2xl h-full transition-all duration-300 relative overflow-hidden border ${
										plan.popular
											? 'border-primary/50 shadow-lg shadow-primary/5'
											: 'border-border/50 hover:border-primary/30 hover:shadow-md'
									}`}
									whileHover={{ y: -4 }}
									transition={{ duration: 0.3 }}
								>
									{/* Subtle background glow on hover - only for popular */}
									{plan.popular && <div className="absolute inset-0 bg-primary/5 opacity-100" />}

									{/* Content */}
									<div className="relative z-10">
										{/* Icon Header - Simplified */}
										<div className="flex justify-center mb-6">
											<div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-primary/15">
												<plan.icon className="w-7 h-7 text-primary" />
											</div>
										</div>

										{/* Plan Name */}
										<h3 className="text-2xl font-bold text-center mb-6">{plan.name}</h3>

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

										{/* Features List - Simplified */}
										<ul className="space-y-4 mb-8">
											{plan.serverFeeIdr !== null ? (
												<>
													<li className="flex items-start">
														<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
														<span className="text-sm leading-relaxed">
															Website design & development:{' '}
															<span className="font-semibold text-primary">FREE</span>
														</span>
													</li>
													<li className="flex items-start">
														<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
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
												<li className="flex items-start">
													<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
													<span className="text-sm leading-relaxed">
														Quotation available upon request
													</span>
												</li>
											)}
										</ul>

										{/* CTA Button - Simplified */}
										<Button
											className={`w-full ${
												plan.popular ? 'bg-primary hover:bg-primary/90 shadow-md' : ''
											}`}
											variant={plan.popular ? 'default' : 'outline'}
											size="lg"
											onClick={() =>
												document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
											}
										>
											<span className="font-semibold">{plan.cta}</span>
											{plan.popular && <Star className="w-4 h-4 ml-2 fill-current" />}
										</Button>
									</div>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* More than 15 Pages - Simplified */}
					<motion.div
						variants={itemVariants}
						className="relative group"
						whileHover={{ y: -4 }}
						transition={{ duration: 0.3 }}
					>
						<div className="card-gradient p-10 sm:p-12 rounded-2xl max-w-3xl mx-auto relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
							{/* Content */}
							<div className="relative z-10 text-center">
								{/* Icon - Simplified */}
								<div className="flex justify-center mb-6">
									<div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-primary/15">
										<Crown className="w-8 h-8 text-primary" />
									</div>
								</div>

								<h3 className="text-3xl sm:text-4xl font-bold mb-4">More than 15 Pages</h3>
								<p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
									Quotation available upon request. Kami akan menyesuaikan scope, fitur, dan
									timeline sesuai kebutuhan Anda.
								</p>

								{/* CTA Buttons - Simplified */}
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button
										variant="outline"
										size="lg"
										className="font-semibold"
										onClick={() =>
											document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
										}
									>
										<Sparkles className="w-4 h-4 mr-2" />
										Request Quote
									</Button>
									<Button
										size="lg"
										className="bg-primary hover:bg-primary/90 shadow-md font-semibold"
										onClick={() =>
											document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
										}
									>
										Discuss Requirements
										<Rocket className="w-4 h-4 ml-2" />
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Pricing;
