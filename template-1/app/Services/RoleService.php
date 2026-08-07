<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleService
{
    public function store(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create(['name' => $data['name']]);
            
            if (isset($data['selectedPermission'])) {
                $role->syncPermissions($data['selectedPermission']);
            }
            
            return $role;
        });
    }

    public function update(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update(['name' => $data['name']]);
            
            if (isset($data['selectedPermission'])) {
                $role->syncPermissions($data['selectedPermission']);
            }
            
            return $role;
        });
    }

    public function destroy(array $ids): void
    {
        Role::whereIn('id', $ids)->delete();
    }
}
