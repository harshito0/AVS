import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'blue' | 'gray' | 'red' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-full',
    md: 'text-xs px-2.5 py-1 font-medium rounded-full'
  };

  const variantClasses = {
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    gold: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200/80',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    red: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    outline: 'bg-white text-slate-700 border border-slate-300'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 leading-none transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
