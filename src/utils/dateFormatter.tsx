/**
 * Date Formatter Utility
 * Reusable function untuk format blog dates dengan proper validation
 * Handles draft blogs, null dates, dan invalid timestamps (epoch 0)
 */

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

/**
 * Interface untuk Blog object (minimal fields needed)
 */
interface BlogDateInfo {
	isPublished: boolean;
	publishedAt: string | Date | null;
}

/**
 * Format blog date dengan validation
 * Returns formatted date string atau React Badge component
 * 
 * Validation rules:
 * 1. Draft blogs → Show "Draft" badge
 * 2. Published but null date → Show "Date pending" badge
 * 3. Published but epoch 0 (1970) → Show "Date pending" badge
 * 4. Valid date → Show formatted date (MMM dd, yyyy)
 */
export const formatBlogDate = (blog: BlogDateInfo): string | JSX.Element => {
	// Draft blogs - tampilkan badge "Draft"
	if (!blog.isPublished) {
		return <Badge variant="secondary">Draft</Badge>;
	}

	// Published blogs - validate date exists
	if (!blog.publishedAt) {
		return <Badge variant="outline">Date pending</Badge>;
	}

	// Convert to Date object dan validate
	const date = new Date(blog.publishedAt);

	// Check untuk invalid date atau epoch 0 (Jan 1, 1970)
	if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
		return <Badge variant="outline">Date pending</Badge>;
	}

	// Valid date - return formatted string
	return format(date, 'MMM dd, yyyy');
};

/**
 * Get formatted date string only (no JSX)
 * Useful untuk text-only contexts
 */
export const formatBlogDateString = (blog: BlogDateInfo): string => {
	if (!blog.isPublished) {
		return 'Draft';
	}

	if (!blog.publishedAt) {
		return 'Date pending';
	}

	const date = new Date(blog.publishedAt);

	if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
		return 'Date pending';
	}

	return format(date, 'MMM dd, yyyy');
};
