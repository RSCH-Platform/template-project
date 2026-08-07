import React from 'react';

export default function SectionCard({ title, icon, children, className }) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 ${className || ''}`}>
            {(title || icon) && (
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}
