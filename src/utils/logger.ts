// Safe Logger Utility - Prevents sensitive data exposure in production
// Only logs in development mode, completely silent in production
// Never exposes backend URLs, API endpoints, or technical error details

// Check if running in development mode
const isDevelopment = import.meta.env.DEV;

/**
 * Safe logger utility untuk production-safe logging
 * - Development: Logs to console untuk debugging
 * - Production: Silently fails (no console output)
 * 
 * Purpose: Prevent backend URLs, API endpoints, dan technical details dari terekspose
 */
export const logger = {
	/**
	 * Debug level - terendah, untuk verbose information
	 * Production: DISABLED (silent)
	 * Development: console.log
	 */
	debug: (...args: unknown[]): void => {
		if (isDevelopment) {
			console.log('[DEBUG]', ...args);
		}
		// Production: do nothing
	},

	/**
	 * Info level - informational messages
	 * Production: DISABLED (silent)
	 * Development: console.log
	 */
	info: (...args: unknown[]): void => {
		if (isDevelopment) {
			console.log('[INFO]', ...args);
		}
		// Production: do nothing
	},

	/**
	 * Warn level - warning messages (non-critical)
	 * Production: DISABLED (silent)
	 * Development: console.warn
	 */
	warn: (...args: unknown[]): void => {
		if (isDevelopment) {
			console.warn('[WARN]', ...args);
		}
		// Production: do nothing
	},

	/**
	 * Error level - ERROR MESSAGES (NEVER log to console in production!)
	 * Production: DISABLED (silent) - prevents exposing sensitive error details
	 * Development: console.error (hanya message, tidak full error object!)
	 * 
	 * CRITICAL: Never expose error objects yang mengandung:
	 * - Backend URLs
	 * - API endpoints
	 * - Stack traces
	 * - Technical details
	 */
	error: (...args: unknown[]): void => {
		if (isDevelopment) {
			// Development: log message only, not full error objects
			// This prevents exposing stack traces, URLs, and technical details
			const safeArgs = args.map((arg) => {
				if (arg instanceof Error) {
					// Only log error message, not the full error object with stack trace
					return arg.message;
				}
				if (typeof arg === 'object' && arg !== null) {
					// Don't log objects that might contain sensitive data
					return '[Object]';
				}
				return arg;
			});
			console.error('[ERROR]', ...safeArgs);
		}
		// Production: SILENT - error details tidak boleh terekspose
		// TODO: Could send to error tracking service (Sentry, etc) jika diperlukan
	},

	/**
	 * Sanitized error untuk user display
	 * Mengubah technical error menjadi user-friendly message
	 * 
	 * @param error - Error object dari API/network
	 * @returns User-friendly error message (no technical details)
	 */
	getSafeErrorMessage: (error: unknown): string => {
		if (isDevelopment) {
			// Only log message, not full error object (prevents exposing stack traces)
			if (error instanceof Error) {
				console.error('[DEBUG ERROR DETAILS]', error.message);
			} else {
				console.error('[DEBUG ERROR DETAILS]', String(error));
			}
		}

		// Never expose technical details to user
		// Check for specific error types dan map ke user-friendly messages

		if (error instanceof TypeError) {
			// Network error, CORS issue, etc
			return 'Connection failed. Please try again.';
		}

		if (error instanceof Error) {
			const message = error.message.toLowerCase();

			// Check for custom error messages first (from API)
			if (message.includes('email/password wrong')) {
				return 'Email/Password Wrong';
			}

			if (message.includes('email not found')) {
				return 'Email not found';
			}

			// Check for HTTP status patterns
			if (message.includes('401') || message.includes('unauthorized') || message.includes('invalid')) {
				return 'Email/Password Wrong';
			}

			if (message.includes('403') || message.includes('forbidden') || message.includes('access denied')) {
				return 'Access denied. Please contact administrator.';
			}

			if (message.includes('404') || message.includes('not found')) {
				return 'Resource not found. Please try again.';
			}

			if (message.includes('429') || message.includes('too many')) {
				return 'Too many attempts. Please try again later.';
			}

			if (message.includes('500') || message.includes('server error')) {
				return 'Server error. Please try again later.';
			}

			// Check for network errors
			if (
				message.includes('fetch') ||
				message.includes('network') ||
				message.includes('connection') ||
				message.includes('timeout')
			) {
				return 'Connection failed. Please try again.';
			}
		}

		// Default generic message
		return 'An unexpected error occurred. Please try again.';
	},
};

// Export untuk convenience
export default logger;
