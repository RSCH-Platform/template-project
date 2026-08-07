import React from 'react';

export default function Badge({ label, icon: Icon, variant = 'accent' }) {
    const variants = {
        accent: 'bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-400',
        info:   'bg-info-100 dark:bg-info-900/50 text-info-700 dark:text-info-400',
        success:'bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-400',
        warning:'bg-warning-100 dark:bg-warning-900/50 text-warning-700 dark:text-warning-400',
        danger: 'bg-danger-100 dark:bg-danger-900/50 text-danger-700 dark:text-danger-400',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${variants[variant]}`}>
            {Icon && <Icon size={12} />}
            {label}
        </span>
    );
}
