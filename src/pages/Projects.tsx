import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const projectCategories = [
    {
      id: "web-design",
      title: "Web Design",
      description: "Creative and modern web designs that captivate users",
      projects: [
        {
          title: "E-Commerce Fashion Store",
          description: "Modern fashion e-commerce platform with sleek design and seamless user experience.",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
          tags: ["UI/UX", "E-Commerce", "Responsive"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Creative Agency Portfolio",
          description: "Bold and creative portfolio website for a digital agency with stunning animations.",
          image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
          tags: ["Portfolio", "Creative", "Animation"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Restaurant Landing Page",
          description: "Elegant restaurant website with online reservation system and menu showcase.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop",
          tags: ["Restaurant", "Booking", "Food"],
          liveUrl: "#",
          githubUrl: "#"
        }
      ]
    },
    {
      id: "web-development",
      title: "Website Development",
      description: "Full-stack web applications built with modern technologies",
      projects: [
        {
          title: "Task Management System",
          description: "Comprehensive project management tool with real-time collaboration features.",
          image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
          tags: ["React", "Node.js", "MongoDB"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Social Media Dashboard",
          description: "Analytics dashboard for social media management with data visualization.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
          tags: ["Dashboard", "Analytics", "Charts"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Learning Management System",
          description: "Educational platform with course management, quizzes, and progress tracking.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop",
          tags: ["Education", "LMS", "Video"],
          liveUrl: "#",
          githubUrl: "#"
        }
      ]
    },
    {
      id: "mobile-development",
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      projects: [
        {
          title: "Fitness Tracking App",
          description: "Comprehensive fitness app with workout tracking, nutrition planning, and social features.",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
          tags: ["React Native", "Health", "Social"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Food Delivery App",
          description: "On-demand food delivery platform with real-time tracking and payment integration.",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
          tags: ["Flutter", "Delivery", "Payments"],
          liveUrl: "#",
          githubUrl: "#"
        },
        {
          title: "Meditation & Wellness App",
          description: "Mindfulness app with guided meditations, sleep stories, and progress tracking.",
          image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop",
          tags: ["Wellness", "Audio", "iOS/Android"],
          liveUrl: "#",
          githubUrl: "#"
        }
      ]
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold gradient-text">Company</span>
            </Link>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Explore our portfolio of innovative digital solutions across web design, 
              development, and mobile applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pb-20"
      >
        {projectCategories.map((category, categoryIndex) => (
          <motion.section
            key={category.id}
            variants={itemVariants}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {category.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.projects.map((project, projectIndex) => (
                <motion.div
                  key={projectIndex}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Github className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* CTA Section */}
        <motion.section
          variants={itemVariants}
          className="text-center py-16"
        >
          <div className="card-gradient p-12 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let's discuss how we can bring your vision to life with cutting-edge technology and innovative design.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary">
              <Link to="/#contact">Get Started Today</Link>
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Projects;