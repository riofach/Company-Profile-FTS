// Rich Text Editor Component - Wrapper untuk ReactQuill dengan dynamic loading
// Menghindari findDOMNode warning dengan lazy loading

import { useEffect, useRef, lazy, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';

// Dynamic import ReactQuill untuk menghindari SSR issues dan warning
const ReactQuill = lazy(() => import('react-quill'));

// Interface untuk RichTextEditor props
interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	minHeight?: string;
	modules?: any;
}

// Component RichTextEditor
const RichTextEditor = ({ 
	value, 
	onChange, 
	placeholder = 'Write your content here...', 
	minHeight = '300px',
	modules 
}: RichTextEditorProps) => {
	// Default modules configuration untuk Quill toolbar
	const defaultModules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ indent: '-1' }, { indent: '+1' }],
			[{ align: [] }],
			['link', 'image'],
			['clean'],
		],
	};

	// Use provided modules atau default
	const editorModules = modules || defaultModules;

	// Loading fallback component
	const LoadingEditor = () => (
		<div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="text-center">
				<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
				<p className="text-sm text-muted-foreground">Loading editor...</p>
			</div>
		</div>
	);

	return (
		<div className="rich-text-editor-wrapper">
			<Suspense fallback={<LoadingEditor />}>
				<div className="border rounded-lg" style={{ minHeight }}>
					<ReactQuill
						theme="snow"
						value={value}
						onChange={onChange}
						modules={editorModules}
						placeholder={placeholder}
						style={{ minHeight }}
					/>
				</div>
			</Suspense>
		</div>
	);
};

export default RichTextEditor;
