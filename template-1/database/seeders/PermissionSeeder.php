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


        // Units CRUD
        $create('units-access'); $create('units-create');
        $create('units-update'); $create('units-delete');



        // Staff Management (existing)
        $create('users-access'); $create('users-create');
        $create('users-update'); $create('users-delete');
        $create('roles-access'); $create('roles-create');
        $create('roles-update'); $create('roles-delete');
        $create('permissions-access');



        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
