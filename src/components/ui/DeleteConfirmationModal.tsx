import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';

// Interface untuk DeleteConfirmationModal props
interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	itemName: string;
	isLoading?: boolean;
}

// Komponen DeleteConfirmationModal untuk konfirmasi delete action
// Mendukung light/dark mode dengan design yang konsisten
const DeleteConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	itemName,
	isLoading = false,
}: DeleteConfirmationModalProps) => {
	// Jika modal tidak open, tidak render apa-apa
	if (!isOpen) return null;

	// Handle backdrop click
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onClose();
		}
	};

	// Handle confirm action
	const handleConfirm = () => {
		if (!isLoading) {
			onConfirm();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			onClick={handleBackdropClick}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.9, y: 20 }}
				transition={{ duration: 0.2 }}
				className="w-full max-w-md"
				onClick={(e) => e.stopPropagation()}
			>
				<Card className="p-6 shadow-2xl border-border/50 bg-background/95 backdrop-blur-sm">
					{/* Header */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-5 h-5 text-destructive" />
							</div>
							<h3 className="text-lg font-semibold">{title}</h3>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							disabled={isLoading}
							className="h-8 w-8"
						>
							<X className="w-4 h-4" />
						</Button>
					</div>

					{/* Content */}
					<div className="mb-6">
						<p className="text-muted-foreground mb-3">{description}</p>
						<div className="p-3 bg-muted/50 rounded-lg border border-border/50">
							<p className="text-sm font-medium text-foreground">Item to delete:</p>
							<p className="text-sm text-muted-foreground break-words">{itemName}</p>
						</div>
						<p className="text-xs text-destructive mt-3">
							<strong>Warning:</strong> This action cannot be undone.
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3 justify-end">
						<Button
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
							className="min-w-[80px]"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirm}
							disabled={isLoading}
							className="min-w-[80px]"
						>
							{isLoading ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Deleting...</span>
								</div>
							) : (
								'Delete'
							)}
						</Button>
					</div>
				</Card>
			</motion.div>
		</motion.div>
	);
};

export default DeleteConfirmationModal;
