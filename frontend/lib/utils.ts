import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function formatTime(time: string) {
  return time?.slice(0, 5) || '';
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}
