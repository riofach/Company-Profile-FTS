import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import BlogCard from './BlogCard';
import { BlogPost, getPublishedBlogs, getBlogsByCategory } from '@/data/mockBlogs';

// Interface untuk BlogList props
interface BlogListProps {
	onBlogClick: (slug: string) => void;
}

// Component BlogList untuk menampilkan list semua blogs
const BlogList = ({ onBlogClick }: BlogListProps) => {
	// State untuk search, filter, dan view mode
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	// Get all published blogs
	const allBlogs = getPublishedBlogs();

	// Get unique categories
	const categories = ['all', ...Array.from(new Set(allBlogs.map((blog) => blog.category)))];

	// Get unique tags
	const allTags = Array.from(new Set(allBlogs.flatMap((blog) => blog.tags)));

	// Filter blogs berdasarkan search term dan category
	const filteredBlogs = allBlogs.filter((blog) => {
		const matchesSearch =
			blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-center mb-12"
			>
				<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
					Our <span className="text-primary">Blog</span>
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
					Insights, trends, and expertise from our team of technology professionals. Stay updated
					with the latest in web development, mobile apps, cloud solutions, and cybersecurity.
				</p>
			</motion.div>

			{/* Search and Filter Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="mb-8"
			>
				<div className="flex flex-col gap-4">
					{/* Search and Filter Row */}
					<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
						{/* Search Input */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								type="text"
								placeholder="Search blogs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10"
							/>
						</div>

						{/* Category Filter */}
						<Select value={selectedCategory} onValueChange={setSelectedCategory}>
							<SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category === 'all' ? 'All Categories' : category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* View Mode Toggle - Moved to left */}
					<div className="flex gap-2 justify-start">
						<Button
							variant={viewMode === 'grid' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setViewMode('grid')}
							className="p-2 h-10"
						>
							<Grid className="w-4 h-4" />
						</Button>
						<Button
							variant={viewMode === 'list' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setViewMode('list')}
							className="p-2 h-10"
						>
							<List className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Active Filters Display */}
				{(searchTerm || selectedCategory !== 'all') && (
					<div className="flex flex-wrap gap-2 mt-4">
						{searchTerm && (
							<Badge variant="secondary" className="gap-2">
								Search: "{searchTerm}"
								<button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">
									×
								</button>
							</Badge>
						)}
						{selectedCategory !== 'all' && (
							<Badge variant="secondary" className="gap-2">
								Category: {selectedCategory}
								<button
									onClick={() => setSelectedCategory('all')}
									className="ml-1 hover:text-red-500"
								>
									×
								</button>
							</Badge>
						)}
					</div>
				)}
			</motion.div>

			{/* Results Count */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="mb-6"
			>
				<p className="text-gray-600 dark:text-gray-400">
					Showing {filteredBlogs.length} of {allBlogs.length} blog posts
				</p>
			</motion.div>

			{/* Blog Grid/List */}
			{filteredBlogs.length > 0 ? (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
							: 'space-y-6'
					}
				>
					{filteredBlogs.map((blog) => (
						<BlogCard key={blog.id} blog={blog} onReadMore={onBlogClick} />
					))}
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center py-12"
				>
					<div className="text-gray-400 dark:text-gray-500 mb-4">
						<Search className="w-16 h-16 mx-auto" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						No blogs found
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Try adjusting your search terms or filters
					</p>
					<Button
						variant="outline"
						onClick={() => {
							setSearchTerm('');
							setSelectedCategory('all');
						}}
					>
						Clear Filters
					</Button>
				</motion.div>
			)}

			{/* Popular Tags */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.6 }}
				className="mt-12"
			>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
				<div className="flex flex-wrap gap-2">
					{allTags.slice(0, 10).map((tag, index) => (
						<Badge
							key={index}
							variant="outline"
							className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
							onClick={() => setSearchTerm(tag)}
						>
							{tag}
						</Badge>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default BlogList;
