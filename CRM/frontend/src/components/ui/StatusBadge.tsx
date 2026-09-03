import React from 'react';
import { Badge } from './Badge';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'paid':
    case 'active':
    case 'converted':
    case 'completed':
    case 'confirmed':
    case 'published':
      return (
        <Badge variant="green" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          {status}
        </Badge>
      );

    case 'pending':
    case 'follow up':
    case 'partially used':
      return (
        <Badge variant="gold" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
          {status}
        </Badge>
      );

    case 'overdue':
    case 'dead':
    case 'cancelled':
    case 'expired':
    case 'no show':
      return (
        <Badge variant="red" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block" />
          {status}
        </Badge>
      );

    case 'redeemed':
    case 'draft':
    case 'inactive':
      return (
        <Badge variant="gray" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
          {status}
        </Badge>
      );

    case 'brampton':
      return (
        <Badge variant="green" className={`bg-[#EAF3EE] text-[#0F291E] border-[#C8DFD1] ${className}`}>
          {status}
        </Badge>
      );

    case 'mississauga':
      return (
        <Badge variant="gold" className={`bg-[#FAF5EA] text-[#8E733B] border-[#E8DCC0] ${className}`}>
          {status}
        </Badge>
      );

    default:
      return (
        <Badge variant="gray" className={className}>
          {status}
        </Badge>
      );
  }
};
