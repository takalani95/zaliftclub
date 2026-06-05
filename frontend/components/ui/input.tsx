'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        className={cn(
          'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'placeholder:text-gray-400 disabled:opacity-50 disabled:bg-gray-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
