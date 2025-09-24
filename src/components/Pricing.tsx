import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { Check, Star } from 'lucide-react';
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
		},
		{
			name: 'Up to 10 Pages',
			serverFeeIdr: 1200000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: true,
			cta: 'Most Popular',
		},
		{
			name: 'Up to 15 Pages',
			serverFeeIdr: 1600000,
			contractNote: '(36 months contract – last 6 months free)',
			popular: false,
			cta: 'Contact Us',
		},
	];

	// Toggle mata uang: true -> tampil USD, false -> tampil IDR
	const [showUSD, setShowUSD] = useState(false);

	const formatMonthly = useMemo(() => {
		return (idr: number) =>
			showUSD ? `${formatUSD(convertIdrToUsd(idr))} / month` : `${formatIDR(idr)} / month`;
	}, [showUSD]);

	return (
		<section ref={ref} id="pricing" className="py-20 bg-background">
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
							Simple <span className="gradient-text">Pricing</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Transparent pricing with no hidden fees. Choose the plan that best fits your project
							needs and budget.
						</p>
						<div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
							<span className={!showUSD ? 'font-semibold text-foreground' : ''}>IDR</span>
							<Switch checked={showUSD} onCheckedChange={setShowUSD} aria-label="Toggle currency" />
							<span className={showUSD ? 'font-semibold text-foreground' : ''}>USD</span>
						</div>
					</motion.div>

					{/* Pricing Cards */}
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 justify-items-center">
						{plans.map((plan, index) => (
							<motion.div key={index} variants={itemVariants} className="relative group">
								<motion.div
									className={`card-gradient p-8 rounded-xl h-full transition-all duration-300 ${
										plan.popular ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''
									}`}
									whileHover={{ scale: 1.02, y: -5 }}
									transition={{ duration: 0.3 }}
								>
									{/* Popular Badge */}
									{plan.popular && (
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full">
												<Star className="w-3 h-3 mr-1" />
												Most Popular
											</Badge>
										</div>
									)}

									{/* Plan Header */}
									<div className="text-center mb-8">
										<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
										{plan.serverFeeIdr !== null ? (
											<div className="mb-2">
												<div>
													<span className="text-3xl font-bold gradient-text">
														{formatMonthly(plan.serverFeeIdr).split(' / ')[0]}
													</span>
													<span className="text-muted-foreground ml-2">/ month</span>
												</div>
												<div className="text-xs text-muted-foreground">
													{showUSD
														? `≈ ${formatIDR(plan.serverFeeIdr)} / month`
														: `≈ ${formatUSD(convertIdrToUsd(plan.serverFeeIdr))} / month`}
												</div>
											</div>
										) : (
											<p className="text-muted-foreground text-sm">
												Quotation available upon request
											</p>
										)}
									</div>

									{/* Features */}
									<ul className="space-y-3 mb-8">
										{plan.serverFeeIdr !== null ? (
											<>
												<li className="flex items-start">
													<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
													<span className="text-sm">Website design & development: FREE</span>
												</li>
												<li className="flex items-start">
													<Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
													<span className="text-sm">
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
												<span className="text-sm">Quotation available upon request</span>
											</li>
										)}
									</ul>

									{/* CTA Button */}
									<Button
										className={`w-full ${
											plan.popular
												? 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary'
												: ''
										}`}
										variant={plan.popular ? 'default' : 'outline'}
										size="lg"
										onClick={() =>
											document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
										}
									>
										{plan.cta}
									</Button>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* More than 15 Pages - menggantikan section Additional Info */}
					<motion.div variants={itemVariants} className="text-center">
						<div className="card-gradient p-8 rounded-xl max-w-3xl mx-auto">
							<h3 className="text-2xl font-bold mb-4">More than 15 Pages</h3>
							<p className="text-muted-foreground mb-6">
								Quotation available upon request. Kami akan menyesuaikan scope, fitur, dan timeline
								sesuai kebutuhan Anda.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									variant="outline"
									size="lg"
									onClick={() =>
										document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
									}
								>
									Request Quote
								</Button>
								<Button
									size="lg"
									className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
									onClick={() =>
										document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
									}
								>
									Discuss Requirements
								</Button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Pricing;
