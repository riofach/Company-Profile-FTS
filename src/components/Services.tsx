import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Smartphone, Cloud, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with modern technologies and frameworks for optimal performance and user experience.",
      features: ["React & Next.js", "Full-Stack Solutions", "API Integration", "Responsive Design"]
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver seamless experiences across all devices.",
      features: ["iOS & Android", "React Native", "Flutter", "App Store Optimization"]
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and services that grow with your business needs and ensure reliability.",
      features: ["AWS & Azure", "Serverless Architecture", "DevOps", "Auto-scaling"]
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance with industry standards.",
      features: ["Security Audits", "Penetration Testing", "Compliance", "24/7 Monitoring"]
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Advanced optimization techniques to maximize application speed, efficiency, and user satisfaction.",
      features: ["Load Testing", "Code Optimization", "CDN Setup", "Monitoring Tools"]
    },
    {
      icon: Globe,
      title: "Digital Strategy",
      description: "Strategic consulting to help you navigate digital transformation and achieve your business objectives.",
      features: ["Technology Roadmap", "Digital Transformation", "Consulting", "Market Analysis"]
    }
  ];

  return (
    <section ref={ref} id="services" className="py-20 bg-muted/30">
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
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of digital services designed to help your business succeed in today's competitive landscape.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  className="card-gradient p-8 rounded-xl h-full hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="card-gradient p-8 rounded-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-muted-foreground mb-6">
                We specialize in creating tailored solutions that fit your unique business requirements. Let's discuss your project.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;