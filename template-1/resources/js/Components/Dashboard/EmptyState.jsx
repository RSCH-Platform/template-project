import React from 'react';

export default function EmptyState({ icon: Icon, title, description, children }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                {Icon && (
                    <Icon
                        size={32}
                        className="text-slate-400"
                        strokeWidth={1.5}
                    />
                )}
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {description}
            </p>
            {children}
        </div>
    );
}
