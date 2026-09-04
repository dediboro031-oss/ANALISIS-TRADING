import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAddon?: string | React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightAddon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-neutral-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0D0D0D] border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-[#333] focus:border-[#F2C94C]'
          } rounded px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
            leftIcon ? 'pl-9' : ''
          } ${rightAddon ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3 text-xs font-semibold text-gray-400 pointer-events-none">
            {rightAddon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#0D0D0D] border ${
          error ? 'border-red-500' : 'border-[#333] focus:border-[#F2C94C]'
        } rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A1A] text-gray-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
