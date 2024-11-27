"use client";

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, success, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={clsx(
              "w-full px-4 py-2 rounded-lg border transition-all duration-200",
              "focus:outline-none focus:ring-2",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/50"
                : success
                ? "border-green-300 focus:border-green-500 focus:ring-green-500/50"
                : "border-gray-300 focus:border-primary focus:ring-primary/50",
              "dark:bg-gray-800 dark:border-gray-600",
              isFocused && "scale-[1.01]",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
            {error && (
              <svg
                className="h-5 w-5 text-red-500 animate-bounce"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {success && (
              <svg
                className="h-5 w-5 text-green-500 animate-scale"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-shake">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
