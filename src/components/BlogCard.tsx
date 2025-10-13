import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BlogPost } from '@/data/mockBlogs';
import { format } from 'date-fns';

// Interface untuk BlogCard props
interface BlogCardProps {
	blog: BlogPost;
	onReadMore: (slug: string) => void;
}

// Component BlogCard untuk menampilkan preview blog
const BlogCard = ({ blog, onReadMore }: BlogCardProps) => {
	// Format tanggal untuk display
	const formattedDate = format(new Date(blog.publishedAt), 'MMM dd, yyyy');

	// Animation variants untuk card
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
		hover: {
			y: -5,
			transition: { duration: 0.2 },
		},
	};

	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			whileHover="hover"
			className="h-full"
		>
			<Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
				{/* Featured Image */}
				<div className="relative h-48 overflow-hidden">
					<img
						src={blog.featuredImage}
						alt={blog.title}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
						onError={(e) => {
							// Fallback image jika featured image tidak ada
							e.currentTarget.src = '/placeholder.svg';
						}}
					/>
					{/* Category Badge */}
					<div className="absolute top-4 left-4">
						<Badge
							variant="secondary"
							className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-sm"
						>
							{blog.category}
						</Badge>
					</div>
				</div>

				<CardContent className="flex-1 p-6">
					{/* Title */}
					<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary transition-colors">
						{blog.title}
					</h3>

					{/* Excerpt */}
					<p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
						{blog.excerpt}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mb-4">
						{blog.tags.slice(0, 3).map((tag, index) => (
							<Badge
								key={index}
								variant="outline"
								className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
							>
								{tag}
							</Badge>
						))}
						{blog.tags.length > 3 && (
							<Badge variant="outline" className="text-xs">
								+{blog.tags.length - 3} more
							</Badge>
						)}
					</div>
				</CardContent>

				<CardFooter className="p-6 pt-0">
					<div className="w-full">
						{/* Author Info */}
						<div className="flex items-center gap-3 mb-4">
							<img
								src={blog.author.avatar}
								alt={blog.author.name}
								className="w-10 h-10 rounded-full object-cover"
								onError={(e) => {
									e.currentTarget.src = '/placeholder.svg';
								}}
							/>
							<div className="flex-1">
								<p className="font-medium text-gray-900 dark:text-white text-sm">
									{blog.author.name}
								</p>
								<p className="text-gray-500 dark:text-gray-400 text-xs">{blog.author.role}</p>
							</div>
						</div>

						{/* Meta Info */}
						<div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									<span>{formattedDate}</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock className="w-4 h-4" />
									<span>{blog.readTime} min read</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<Eye className="w-4 h-4" />
								<span>{blog.views.toLocaleString()}</span>
							</div>
						</div>

						{/* Read More Button */}
						<Button
							onClick={() => onReadMore(blog.slug)}
							className="w-full bg-primary hover:bg-primary/90 text-white"
						>
							Read More
						</Button>
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default BlogCard;
