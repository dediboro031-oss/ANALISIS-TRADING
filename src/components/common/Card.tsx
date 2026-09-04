import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  hover = false
}) => {
  return (
    <div
      id={id}
      className={`bg-[#1A1A1A] border border-[#333] rounded-lg shadow-sm transition-all duration-150 ${
        hover ? 'hover:border-[#444] hover:bg-[#1E1E1E]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  if (children) {
    return <div className={`p-4 border-b border-[#333] ${className}`}>{children}</div>;
  }
  return (
    <div className={`p-4 border-b border-[#333] flex items-start justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="font-bold text-sm text-white tracking-tight">{title}</h3>}
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
