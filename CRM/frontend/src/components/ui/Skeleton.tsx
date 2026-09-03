import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  height?: string | number;
  width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  height,
  width
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl h-36 w-full'
  };

  const style: React.CSSProperties = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200/70 ${variantClasses[variant]} ${className}`}
    />
  );
};
