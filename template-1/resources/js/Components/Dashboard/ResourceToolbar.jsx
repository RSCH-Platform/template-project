import React from 'react';
import Search from './Search';
import PerPage from './PerPage';
import { IconLayoutGrid, IconList } from '@tabler/icons-react';

export default function ResourceToolbar({
    url,
    searchPlaceholder = 'Cari...',
    viewMode,
    onViewModeChange,
    children, // slot untuk tombol filter tambahan
}) {
    return (
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-80">
                <Search url={url} placeholder={searchPlaceholder} />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {children}
                <PerPage url={url} />
                {onViewModeChange && (
                    <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <IconLayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <IconList size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
