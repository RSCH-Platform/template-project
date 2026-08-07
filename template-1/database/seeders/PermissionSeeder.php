<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $create = fn ($name) => Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);

        // dashboard permissions
        $create('dashboard-access');


        // Units CRUD (All)
        $create('units-access-all'); $create('units-create-all');
        $create('units-update-all'); $create('units-delete-all');

        // Units CRUD (Owned)
        $create('units-access-owned'); $create('units-update-owned'); 
        $create('units-delete-owned');



        // Staff Management (existing)
        $create('users-access'); $create('users-create');
        $create('users-update'); $create('users-delete');
        $create('roles-access'); $create('roles-create');
        $create('roles-update'); $create('roles-delete');
        $create('permissions-access');

        // Added from refactoring
        $create('impersonate');

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
