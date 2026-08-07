import React from "react";
import {
    IconUserShield,
    IconShield,
    IconPencilCog,
    IconTrash,
} from "@tabler/icons-react";

export default function RoleCard({ role, onEdit, onDelete, canUpdate, canDelete }) {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                        <IconUserShield size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 capitalize">
                            {role.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {role.permissions.length} perizinan
                        </p>
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div className="h-full p-4 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin">
                    {role.permissions.slice(0, 8).map((permission, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-400"
                        >
                            <IconShield size={10} />
                            {permission.name}
                        </span>
                    ))}
                    {role.permissions.length > 8 && (
                        <span className="px-2 py-0.5 text-xs font-medium text-slate-500">
                            +{role.permissions.length - 8} lainnya
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            {(canUpdate || canDelete) && (
                <div className="mt-auto flex border-t border-slate-100 dark:border-slate-800">
                    {canUpdate && (
                        <button
                            onClick={onEdit}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-950/50 text-sm font-medium transition-colors"
                        >
                            <IconPencilCog size={16} />
                            <span>Edit</span>
                        </button>
                    )}
                    {canUpdate && canDelete && (
                        <div className="w-px bg-slate-100 dark:bg-slate-800" />
                    )}
                    {canDelete && (
                        <button
                            onClick={onDelete}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/50 text-sm font-medium transition-colors"
                        >
                            <IconTrash size={16} />
                            <span>Hapus</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
