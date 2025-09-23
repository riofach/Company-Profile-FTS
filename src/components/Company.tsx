import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Mail, Linkedin, Github, Twitter } from "lucide-react";

const Company = () => {
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

  const team = [
    {
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      bio: "15+ years leading digital transformation initiatives",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Expert in scalable architecture and emerging technologies",
      social: { linkedin: "#", github: "#" }
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Award-winning designer focused on user experience",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "David Kumar",
      role: "Senior Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Full-stack developer with expertise in modern frameworks",
      social: { linkedin: "#", github: "#" }
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative solutions to solve complex challenges."
    },
    {
      title: "Quality",
      description: "Every project is delivered with meticulous attention to detail and the highest standards."
    },
    {
      title: "Transparency",
      description: "Open communication and honest partnerships are the foundation of our relationships."
    },
    {
      title: "Growth",
      description: "We're committed to continuous learning and helping our clients achieve sustainable growth."
    }
  ];

  return (
    <section ref={ref} id="company" className="py-20 bg-muted/30">
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
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our diverse team of experts brings together years of experience and a passion for creating exceptional digital solutions.
            </p>
          </motion.div>

          {/* Team Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-gradient p-6 rounded-xl text-center">
                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-colors">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Member Info */}
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-primary" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Github className="w-4 h-4 text-primary" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Company Values */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-center mb-12">
              Our <span className="gradient-text">Values</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="card-gradient p-6 rounded-xl text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-bold mb-3 gradient-text">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            className="card-gradient p-8 rounded-xl text-center"
          >
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 text-primary mb-2" />
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground text-sm">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-6 h-6 text-primary mb-2" />
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground text-sm">
                  hello@company.com<br />
                  careers@company.com
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 text-primary mb-2 flex items-center justify-center">
                  <span className="text-lg">📞</span>
                </div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground text-sm">
                  +1 (555) 123-4567<br />
                  +1 (555) 987-6543
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Company;