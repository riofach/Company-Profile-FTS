// Custom hook untuk debounce search input
// Menunda eksekusi sampai user selesai mengetik untuk reduce API calls

import { useState, useEffect } from 'react';

/**
 * Hook untuk debounce value (delay eksekusi sampai value berhenti berubah)
 * Useful untuk search input optimization - tunggu user selesai mengetik baru fetch
 * 
 * @param value - Value yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
	// State untuk store debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set timeout untuk update debounced value setelah delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup timeout jika value berubah sebelum delay selesai
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
