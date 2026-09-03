import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  selectable?: boolean;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sortField,
  sortDirection,
  onSort,
  selectedIds,
  onSelectRow,
  onSelectAll,
  selectable = false,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters to find what you are looking for.',
  emptyAction,
  className = '',
  onRowClick
}: TableProps<T>) {
  const isAllSelected = selectable && data.length > 0 && selectedIds?.length === data.length;
  const isSomeSelected = selectable && (selectedIds?.length || 0) > 0 && !isAllSelected;

  return (
    <div className={`w-full overflow-hidden border border-[#E3EAE5] rounded-xl bg-white shadow-sm ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FAFBF9] border-b border-[#E3EAE5] text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              {selectable && (
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-forest-850 focus:ring-forest-700 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`px-4 py-3.5 select-none ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    } ${col.sortable ? 'cursor-pointer hover:text-forest-900 transition-colors' : ''}`}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-forest-850" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-forest-850" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF2EE]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-slate-500">
                    <span className="w-4 h-4 border-2 border-forest-800 border-t-transparent rounded-full animate-spin" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                  <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds?.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors duration-100 hover:bg-[#F7FAF8] ${
                      isSelected ? 'bg-forest-50/50' : 'bg-white'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow && onSelectRow(id)}
                          className="w-4 h-4 rounded border-slate-300 text-forest-850 focus:ring-forest-700 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={`${id}-${col.key}`}
                        className={`px-4 py-3.5 text-[13px] text-slate-700 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(item, idx) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
