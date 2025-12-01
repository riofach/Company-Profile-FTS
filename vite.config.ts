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
	// Konfigurasi server untuk preview dan production
	server: {
		host: true,
		allowedHosts: [
			'company-profile-fts-production.up.railway.app',
			'https://company-profile-fts-production-4541.up.railway.app',
			'fts.biz.id',
			'preview.fts.biz.id',
			'fujiyama-tech.railway.app',
			'localhost',
			'127.0.0.1',
		],
	},
	preview: {
		host: true,
		allowedHosts: [
			'company-profile-fts-production.up.railway.app',
			'preview.fts.biz.id',
			'fujiyama-tech.railway.app',
			'localhost',
			'127.0.0.1',
		],
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
