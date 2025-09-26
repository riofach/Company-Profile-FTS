import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-100px' });
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);

		// Debug logging - check form data
		const formValues = {
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName'),
			email: formData.get('email'),
			company: formData.get('company'),
			subject: formData.get('subject'),
			message: formData.get('message'),
		};

		console.log('Form Data Debug:', formValues);

		// EmailJS configuration - these should be in environment variables
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

		// Prepare email data
		const emailData = {
			from_name: `${formValues.firstName} ${formValues.lastName}`,
			from_email: formValues.email,
			company: formValues.company || 'Not specified',
			subject: formValues.subject,
			message: formValues.message,
			to_email: 'fujiyamatechnologysolution@gmail.com', // Testing email
			reply_to: formValues.email,
		};

		console.log('Email Data to be sent:', emailData);

		try {
			// Send email using EmailJS
			const result = await emailjs.send(serviceId, templateId, emailData, publicKey);

			console.log('EmailJS Result:', result);

			if (result.status === 200) {
				toast({
					title: 'Message Sent Successfully!',
					description:
						"Thank you for contacting Fujiyama Technology Solutions. We'll get back to you shortly.",
				});

				console.log('Email sent successfully to:', emailData.to_email);

				// Reset form
				(e.target as HTMLFormElement).reset();
			}
		} catch (error: unknown) {
			console.error('EmailJS Error:', error);
			console.error('Form data that failed to send:', formValues);
			console.error('Email data that failed to send:', emailData);

			// More specific error messages
			let errorMessage = 'Failed to send message. Please try again.';

			if (error && typeof error === 'object' && 'text' in error) {
				errorMessage = `Email service error: ${String(error.text)}`;
			} else if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = `Error: ${String(error.message)}`;
			}

			toast({
				title: 'Failed to Send Message',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactInfo = [
		{
			icon: Phone,
			title: 'Phone',
			details: ['+62 895 2933 6179', ''],
			link: 'tel:+15551234567',
		},
		{
			icon: Mail,
			title: 'Email',
			details: ['info@fts.biz.id', ''],
			link: 'mailto:info@fts.biz.id',
		},
		{
			icon: MapPin,
			title: 'Address',
			details: ['Neo Soho, Jakarta', ''],
			link: 'https://maps.app.goo.gl/BJcFtsc2o2yvMnWZ8',
		},
		{
			icon: Clock,
			title: 'Business Hours',
			details: ['Mon - Fri: 08:00 AM - 05:00 PM', ''],
			link: null,
		},
	];

	return (
		<section ref={ref} id="contact" className="py-20 bg-background">
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
							Get In <span className="gradient-text">Touch</span>
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Ready to start your next project? We'd love to hear about your ideas and discuss how
							we can help bring them to life.
						</p>
					</motion.div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<motion.div variants={itemVariants}>
							<div className="card-gradient p-8 rounded-xl">
								<h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="firstName" className="block text-sm font-medium mb-2">
												First Name
											</label>
											<Input
												id="firstName"
												name="firstName"
												type="text"
												required
												className="w-full"
												placeholder="John"
											/>
										</div>
										<div>
											<label htmlFor="lastName" className="block text-sm font-medium mb-2">
												Last Name
											</label>
											<Input
												id="lastName"
												name="lastName"
												type="text"
												required
												className="w-full"
												placeholder="Doe"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="email" className="block text-sm font-medium mb-2">
											Email Address
										</label>
										<Input
											id="email"
											name="email"
											type="email"
											required
											className="w-full"
											placeholder="john@example.com"
										/>
									</div>

									<div>
										<label htmlFor="company" className="block text-sm font-medium mb-2">
											Company (Optional)
										</label>
										<Input
											id="company"
											name="company"
											type="text"
											className="w-full"
											placeholder="Your Company"
										/>
									</div>

									<div>
										<label htmlFor="subject" className="block text-sm font-medium mb-2">
											Subject
										</label>
										<Input
											id="subject"
											name="subject"
											type="text"
											required
											className="w-full"
											placeholder="Project Inquiry"
										/>
									</div>

									<div>
										<label htmlFor="message" className="block text-sm font-medium mb-2">
											Message
										</label>
										<Textarea
											id="message"
											name="message"
											required
											className="w-full min-h-[120px]"
											placeholder="Tell us about your project requirements..."
										/>
									</div>

									<Button
										type="submit"
										size="lg"
										className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											'Sending...'
										) : (
											<>
												Send Message
												<Send className="ml-2 w-4 h-4" />
											</>
										)}
									</Button>
								</form>
							</div>
						</motion.div>

						{/* Contact Information */}
						<motion.div variants={itemVariants} className="space-y-6">
							<div className="card-gradient p-8 rounded-xl">
								<h3 className="text-2xl font-bold mb-6">Contact Information</h3>

								<div className="space-y-6">
									{contactInfo.map((info, index) => (
										<motion.div
											key={index}
											className="flex items-start space-x-4 group"
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.2 }}
										>
											<div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
												<info.icon className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h4 className="font-semibold mb-1">{info.title}</h4>
												{info.details.map((detail, detailIndex) => (
													<p key={detailIndex} className="text-muted-foreground text-sm">
														{info.link && detailIndex === 0 ? (
															<a
																href={info.link}
																className="hover:text-primary transition-colors"
																target={info.link.startsWith('http') ? '_blank' : undefined}
																rel={
																	info.link.startsWith('http') ? 'noopener noreferrer' : undefined
																}
															>
																{detail}
															</a>
														) : (
															detail
														)}
													</p>
												))}
											</div>
										</motion.div>
									))}
								</div>
							</div>

							{/* Quick Contact */}
							<motion.div
								className="card-gradient p-6 rounded-xl text-center"
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.3 }}
							>
								<h4 className="text-lg font-bold mb-3">Need Immediate Help?</h4>
								<p className="text-muted-foreground text-sm mb-4">
									For urgent inquiries, call us directly or schedule a consultation.
								</p>
								<div className="flex flex-col sm:flex-row gap-3">
									<Button
										variant="outline"
										className="flex-1"
										onClick={() => window.open('tel:+6289529336179')}
									>
										<Phone className="w-4 h-4 mr-2" />
										Call Now
									</Button>
									<Button
										className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
										onClick={() => window.open('mailto:info@fts.biz.id')}
									>
										<Mail className="w-4 h-4 mr-2" />
										Email Us
									</Button>
								</div>
							</motion.div>

							{/* Response Time */}
							<motion.div
								className="card-gradient p-6 rounded-xl"
								whileHover={{ scale: 1.02 }}
								transition={{ duration: 0.3 }}
							>
								<h4 className="text-lg font-bold mb-3 gradient-text">Response Time</h4>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Email Inquiries:</span>
										<span className="font-medium">Within 4 hours</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Phone Calls:</span>
										<span className="font-medium">Immediate</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Project Quotes:</span>
										<span className="font-medium">Within 24 hours</span>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>

				{/* Location Section: Image (left) + Map (right) */}
				<motion.div variants={itemVariants} className="mt-16 grid md:grid-cols-2 gap-6">
					<div className="card-gradient rounded-xl overflow-hidden">
						<img
							src="/images/neosoho.png"
							alt="Fujiyama Office Building"
							className="w-full h-64 md:h-80 object-cover"
							loading="lazy"
						/>
					</div>
					<div className="card-gradient rounded-xl overflow-hidden">
						<div className="relative w-full h-64 md:h-80">
							<iframe
								title="Fujiyama Location Map"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.3345782813353!2d106.78858139916579!3d-6.175028000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f65ee1c07a31%3A0x2c4c67f4d94e8e65!2sNEO%20SOHO%20Mall!5e0!3m2!1sid!2sid!4v1758699119526!5m2!1sid!2sid"
								width="100%"
								height="100%"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="absolute inset-0 border-0 filter grayscale-0 dark:grayscale"
							/>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Contact;
