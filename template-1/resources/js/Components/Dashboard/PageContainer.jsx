import React from "react";
import { Head, Link } from "@inertiajs/react";
import { IconCirclePlus } from "@tabler/icons-react";

export default function PageContainer({
    title,
    icon,
    description,
    actionLabel,
    actionUrl,
    actions,
    canCreate = true,
    children,
}) {
    return (
        <>
            <Head title={title} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {icon}
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        {actions}
                        {canCreate && actionLabel && actionUrl && (
                            <Link
                                href={actionUrl}
                                className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors"
                            >
                                <IconCirclePlus size={18} strokeWidth={1.5} />
                                {actionLabel}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {children}
        </>
    );
}
