import React from 'react';
import Button from './Button';
import { IconPencilCog, IconTrash, IconUserShare } from '@tabler/icons-react';

export default function ActionButtons({
    canUpdate, canDelete, canImpersonate,
    editHref, deleteUrl, impersonateHref,
    isCurrentUser = false,
}) {
    return (
        <div className="flex gap-2">
            {canImpersonate && !isCurrentUser && (
                <Button type="link"
                    icon={<IconUserShare size={16} strokeWidth={1.5} />}
                    className="border bg-info-100 border-info-200 text-info-600 hover:bg-info-200 dark:bg-info-900/50 dark:border-info-800 dark:text-info-400"
                    href={impersonateHref}
                />
            )}
            {canUpdate && (
                <Button type="edit"
                    icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                    className="border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                    href={editHref}
                />
            )}
            {canDelete && (
                <Button type="delete"
                    icon={<IconTrash size={16} strokeWidth={1.5} />}
                    className="border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                    url={deleteUrl}
                />
            )}
        </div>
    );
}
