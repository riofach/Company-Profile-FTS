import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		preview: {
			host: true,
			port: 8080,
		},
	},
	build: {
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: mode === 'production',
				drop_debugger: mode === 'production',
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
				},
			},
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},
}));
