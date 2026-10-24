import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Plus,
  FolderOpen
} from 'lucide-react';
import { ContentStatus } from '../../types';

// Status Badge Component
export const CMSStatusBadge: React.FC<{
  status?: ContentStatus | string;
  className?: string;
}> = ({ status = 'published', className = '' }) => {
  const norm = String(status).toLowerCase();
  if (norm === 'published' || norm === 'terbit' || norm === 'active' || norm === 'available') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-none bg-emerald-950/80 text-emerald-300 border border-emerald-800 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Terbit
      </span>
    );
  }
  if (norm === 'draft' || norm === 'draf' || norm === 'development' || norm === 'reserved') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-none bg-stone-800 text-stone-300 border border-stone-700 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
        Draf
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-none bg-amber-950/80 text-amber-300 border border-amber-800 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      Arsip
    </span>
  );
};

// Confirmation Modal Dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CMSConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-none shrink-0 ${
              isDestructive ? 'bg-red-950/70 text-red-400 border border-red-900' : 'bg-amber-950/70 text-amber-400 border border-amber-900'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white mb-1">{title}</h3>
            <p className="text-xs text-stone-400 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4 border-t border-stone-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs uppercase tracking-wider font-semibold border border-stone-700 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${
              isDestructive
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const CMSEmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="py-16 px-6 text-center border border-dashed border-stone-800 bg-stone-950/50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 mb-4">
        {icon || <FolderOpen className="w-6 h-6 stroke-1" />}
      </div>
      <h3 className="text-sm font-serif font-semibold text-stone-200 mb-1">{title}</h3>
      <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-stone-950 text-xs uppercase tracking-wider font-bold hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Module Header Component
interface ModuleHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  badge?: string;
  secondaryAction?: React.ReactNode;
}

export const CMSModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  badge,
  secondaryAction
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {title}
          </h2>
          {badge && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-800 text-amber-300 border border-stone-700">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {secondaryAction}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

// Search & Filter Toolbar
interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categories?: { label: string; value: string }[];
  sortValue?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { label: string; value: string }[];
}

export const CMSSearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  categories,
  sortValue,
  onSortChange,
  sortOptions
}) => {
  return (
    <div className="p-3 bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Search Input */}
      <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2">
        <Search className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-white placeholder-stone-500 focus:outline-none text-xs"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} className="text-stone-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category filter if provided */}
        {categories && onCategoryChange && (
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <Filter className="w-3 h-3 text-stone-500" />
            <select
              value={categoryFilter || 'All'}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-stone-900 text-stone-200">
                Semua Kategori
              </option>
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-stone-900 text-stone-200">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
          >
            <option value="All" className="bg-stone-900 text-stone-200">
              Semua Status
            </option>
            <option value="published" className="bg-stone-900 text-stone-200">
              Terbit (Published)
            </option>
            <option value="draft" className="bg-stone-900 text-stone-200">
              Draf (Draft)
            </option>
            <option value="archived" className="bg-stone-900 text-stone-200">
              Arsip (Archived)
            </option>
          </select>
        </div>

        {/* Sort Filter if provided */}
        {sortOptions && onSortChange && (
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <ArrowUpDown className="w-3 h-3 text-stone-500" />
            <select
              value={sortValue || ''}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value} className="bg-stone-900 text-stone-200">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Container
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const CMSModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-[990] animate-fadeIn">
      <div
        className={`bg-stone-900 border border-stone-800 w-full ${maxWidthClass} max-h-[92vh] flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between shrink-0 bg-stone-950">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// Notification Toast
export const CMSToast: React.FC<{
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex items-center gap-3 px-4 py-3 bg-stone-900 border border-stone-700 shadow-2xl text-xs animate-slideUp">
      {type === 'success' ? (
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
      )}
      <span className="text-stone-100 font-medium">{message}</span>
      <button onClick={onClose} className="text-stone-400 hover:text-white ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
