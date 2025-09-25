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
	// TAMBAHKAN BLOK SERVER DI BAWAH INI
	server: {
		preview: {
			// Baris port & host ini bisa dihapus jika sudah ada di package.json,
			// tapi tidak apa-apa jika ada di kedua tempat.
			port: 8080,
			host: true,
			// TAMBAHKAN KONFIGURASI INI:
			allowedHosts: ['company-profile-fts-production.up.railway.app'],
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
