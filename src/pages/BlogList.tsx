import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';

// Page untuk menampilkan list semua blogs
const BlogListPage = () => {
	const navigate = useNavigate();

	// Handle blog click untuk navigasi ke detail
	const handleBlogClick = (slug: string) => {
		navigate(`/blogs/details/${slug}`);
	};

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navigation />
			<BlogList onBlogClick={handleBlogClick} />
			<Footer />
		</main>
	);
};

export default BlogListPage;
