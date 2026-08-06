<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // Refactor the RoleSeeder to improve readability and avoid repetitive code
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $superAdminRole->syncPermissions(Permission::all());

        $kepalaDepartemenRole = Role::firstOrCreate(['name' => 'kepala-departemen']);
        $kepalaDepartemenRole->syncPermissions([
            'dashboard-access',
            'units-access',
            'users-access',
        ]);

        $perawatRole = Role::firstOrCreate(['name' => 'perawat']);
        $perawatRole->syncPermissions([
            'dashboard-access',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Output information to the console
        $roles = Role::with('permissions')->get();
        
        $this->command->info('--- Role Seeder Summary ---');
        $this->command->info('Total Roles Created: ' . $roles->count());
        $this->command->info('Total Permissions Available: ' . Permission::count());
        
        $headers = ['Role Name', 'Permissions Count', 'Example Permissions'];
        $data = $roles->map(function ($role) {
            $perms = $role->permissions->pluck('name');
            $example = $perms->take(3)->join(', ') . ($perms->count() > 3 ? '...' : '');
            return [
                $role->name,
                $perms->count(),
                $example ?: 'None',
            ];
        })->toArray();
        
        $this->command->table($headers, $data);
        $this->command->info('Role seeding completed successfully!');
    }
}
