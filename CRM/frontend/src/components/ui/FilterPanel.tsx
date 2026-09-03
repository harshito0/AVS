import React from 'react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { RotateCcw } from 'lucide-react';

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
  children: React.ReactNode;
  extraFooterContent?: React.ReactNode;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  title = 'Filter Records',
  children,
  extraFooterContent
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Refine results by multiple criteria"
      width="max-w-md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Clear Filters
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {children}
        {extraFooterContent}
      </div>
    </Drawer>
  );
};
