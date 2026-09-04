import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'buy' | 'sell' | 'win' | 'loss' | 'pending' | 'active' | 'warning' | 'neutral' | 'admin';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false
}) => {
  const variantStyles = {
    buy: 'bg-green-500/10 text-green-500 border border-green-500/30 font-bold',
    sell: 'bg-red-500/10 text-red-500 border border-red-500/30 font-bold',
    win: 'bg-green-500/15 text-green-400 border border-green-500/40 font-bold',
    loss: 'bg-red-500/15 text-red-400 border border-red-500/40 font-bold',
    pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    active: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    warning: 'bg-[#F2C94C]/10 text-[#F2C94C] border border-[#F2C94C]/30',
    neutral: 'bg-[#222] text-gray-400 border border-[#333]',
    admin: 'bg-[#F2C94C] text-[#000] font-bold'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
};
