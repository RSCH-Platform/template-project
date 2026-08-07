<?php

namespace App\Traits;

trait HasOwnershipCheck
{
    /**
     * Authorize berdasarkan global permission atau kepemilikan resource.
     * @param string $allPermission
     * @param callable $ownerCheck
     */
    protected function authorizeOwnership(
        string $allPermission,
        callable $ownerCheck
    ): void {
        $user = auth()->user();
        if (!$user->hasPermissionTo($allPermission) && !$ownerCheck($user)) {
            abort(403, 'Unauthorized.');
        }
    }
}
