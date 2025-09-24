import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Formatter dan konversi mata uang sederhana untuk frontend murni
export const CURRENCY = {
	IDR: 'IDR',
	USD: 'USD',
} as const;

export const IDR_PER_USD = 16500; // kurs tetap sesuai permintaan

export function formatIDR(value: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatUSD(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	}).format(value);
}

export function convertIdrToUsd(idrAmount: number): number {
	return idrAmount / IDR_PER_USD;
}
