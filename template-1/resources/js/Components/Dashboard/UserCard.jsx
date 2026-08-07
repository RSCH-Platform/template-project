import React from "react";
import Checkbox from "@/Components/Dashboard/Checkbox";
import { Link } from "@inertiajs/react";
import {
    IconMail,
    IconShield,
    IconUserShare,
    IconPencilCog,
    IconTrash,
    IconBuildingHospital,
} from "@tabler/icons-react";

export default function UserCard({
    user,
    isSelected,
    onSelect,
    onDelete,
    canUpdate,
    canDelete,
    canImpersonate,
    currentUserId,
    loginType,
}) {
    const avatarUrl = user.avatar;
    const initial =
        user.name?.charAt(0)?.toUpperCase() ||
        user[loginType]?.charAt(0)?.toUpperCase() ||
        "?";

    return (
        <div
            className={`
            group bg-white dark:bg-slate-900 rounded-2xl border-2
            ${
                isSelected
                    ? "border-primary-500 dark:border-primary-600"
                    : "border-slate-200 dark:border-slate-800"
            }
            overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200
        `}
        >
            {/* Header with checkbox */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initial
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            {user.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <IconMail size={14} />
                            {user[loginType]}
                        </p>
                    </div>
                </div>
                {canDelete && (
                    <Checkbox
                        value={user.id}
                        onChange={onSelect}
                        checked={isSelected}
                    />
                )}
            </div>

            {/* Roles */}
            <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-400"
                        >
                            <IconShield size={12} />
                            {role.name}
                        </span>
                    ))}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                    {user.units?.map((unit, index) => (
                        <span
                            key={`unit-${index}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-info-100 dark:bg-info-900/50 text-info-700 dark:text-info-400"
                        >
                            <IconBuildingHospital size={12} />
                            {unit.unit_name}
                        </span>
                    ))}
                </div>
            </div>
            </div>

            {/* Actions */}
            {(canUpdate || canDelete || canImpersonate) && (
                <div className="flex border-t border-slate-100 dark:border-slate-800">
                    {canImpersonate && user.id !== currentUserId && (
                        <a
                            href={route("impersonate", user.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-info-600 hover:bg-info-50 dark:hover:bg-info-950/50 text-sm font-medium transition-colors"
                        >
                            <IconUserShare size={16} />
                            <span>Login As</span>
                        </a>
                    )}
                    {canImpersonate && user.id !== currentUserId && (canUpdate || canDelete) && (
                        <div className="w-px bg-slate-100 dark:bg-slate-800" />
                    )}
                    {canUpdate && (
                        <Link
                            href={route("users.edit", user.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-950/50 text-sm font-medium transition-colors"
                        >
                            <IconPencilCog size={16} />
                            <span>Edit</span>
                        </Link>
                    )}
                    {canUpdate && canDelete && (
                        <div className="w-px bg-slate-100 dark:bg-slate-800" />
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(user.id)}
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
