import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
  divider?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  trigger,
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <div onClick={(e) => e.stopPropagation()}>
        {trigger ? (
          <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Actions menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-40 mt-1 w-52 origin-top-right rounded-xl bg-white p-1.5 shadow-lg border border-[#E3EAE5] focus:outline-none animate-scaleUp`}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="my-1 border-t border-slate-100" />}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  item.isDanger
                    ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                    : 'text-slate-700 hover:bg-[#F2F6F3] hover:text-forest-900'
                }`}
              >
                {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
