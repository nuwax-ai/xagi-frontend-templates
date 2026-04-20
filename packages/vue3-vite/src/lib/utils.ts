import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes and remove conflicting duplicates.
 * This keeps component class composition predictable across variants.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a date-like value using locale defaults. */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateValue = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateValue);
}

/** Debounce a function call by wait milliseconds. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Throttle a function call to at most once per limit milliseconds. */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (inThrottle) {
      return;
    }

    fn(...args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}
