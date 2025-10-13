import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogDetail from '@/components/BlogDetail';
import { getBlogBySlug, BlogPost } from '@/data/mockBlogs';

// Page untuk menampilkan detail blog
const BlogDetailPage = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const [blog, setBlog] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);

	// Load blog data berdasarkan slug
	useEffect(() => {
		if (slug) {
			const blogData = getBlogBySlug(slug);
			if (blogData) {
				setBlog(blogData);
			}
			setLoading(false);
		}
	}, [slug]);

	// Handle back navigation
	const handleBack = () => {
		navigate('/blogs');
	};

	// Handle related blog click
	const handleRelatedBlogClick = (relatedSlug: string) => {
		navigate(`/blogs/details/${relatedSlug}`);
	};

	// Loading state
	if (loading) {
		return (
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Navigation />
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-gray-600 dark:text-gray-400">Loading blog...</p>
					</div>
				</div>
				<Footer />
			</main>
		);
	}

	// Blog not found
	if (!blog) {
		return (
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Navigation />
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Blog Not Found
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-8">
							The blog post you're looking for doesn't exist or has been removed.
						</p>
						<button
							onClick={handleBack}
							className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
						>
							Back to Blogs
						</button>
					</div>
				</div>
				<Footer />
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navigation />
			<BlogDetail blog={blog} onBack={handleBack} onRelatedBlogClick={handleRelatedBlogClick} />
			<Footer />
		</main>
	);
};

export default BlogDetailPage;
