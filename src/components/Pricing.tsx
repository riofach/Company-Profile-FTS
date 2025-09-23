import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const plans = [
    {
      name: "Starter",
      price: "$2,999",
      period: "per project",
      description: "Perfect for small businesses and startups looking to establish their digital presence.",
      features: [
        "Responsive Web Design",
        "Up to 5 Pages",
        "Basic SEO Optimization",
        "Contact Form Integration",
        "3 Months Support",
        "Mobile Optimization",
        "Analytics Setup"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$7,999",
      period: "per project",
      description: "Ideal for growing businesses that need advanced features and functionality.",
      features: [
        "Custom Web Application",
        "Unlimited Pages",
        "Advanced SEO & Analytics",
        "CMS Integration",
        "6 Months Support",
        "E-commerce Ready",
        "API Integrations",
        "Performance Optimization",
        "Security Features"
      ],
      popular: true,
      cta: "Most Popular"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      description: "Comprehensive solutions for large organizations with complex requirements.",
      features: [
        "Full-Stack Development",
        "Custom Architecture",
        "Advanced Security",
        "24/7 Support",
        "Dedicated Team",
        "Cloud Infrastructure",
        "Scalable Solutions",
        "Training & Documentation",
        "Ongoing Maintenance"
      ],
      popular: false,
      cta: "Contact Us"
    }
  ];

  return (
    <section ref={ref} id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Choose the plan that best fits your project needs and budget.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
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
                    <div className="mb-4">
                      <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
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
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="card-gradient p-8 rounded-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Need Something Different?
              </h3>
              <p className="text-muted-foreground mb-6">
                Every project is unique. We offer flexible pricing and custom packages tailored to your specific requirements. Let's discuss your needs and create a solution that fits your budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Request Custom Quote
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Schedule Consultation
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