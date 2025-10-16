// Page BlogDetail - Menampilkan detail blog post menggunakan slug dari URL
// Component ini fetch data dari API via BlogDetail component

import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogDetail from '@/components/BlogDetail';

// Page untuk menampilkan detail blog dengan API integration
const BlogDetailPage = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	// Handle back navigation ke blog list
	const handleBack = () => {
		navigate('/blogs');
	};

	// Handle related blog click untuk navigasi ke blog lain
	const handleRelatedBlogClick = (relatedSlug: string) => {
		navigate(`/blogs/details/${relatedSlug}`);
		// Scroll to top saat navigate ke blog lain
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Jika slug tidak ada, redirect ke blog list
	if (!slug) {
		navigate('/blogs');
		return null;
	}

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navigation />
			<BlogDetail 
				blogSlug={slug} 
				onBack={handleBack} 
				onRelatedBlogClick={handleRelatedBlogClick} 
			/>
			<Footer />
		</main>
	);
};

export default BlogDetailPage;
