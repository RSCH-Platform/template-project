<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // 1. Setup Admin
        $admin = User::updateOrCreate(
            ['email' => 'juniyasyos@gmail.com'],
            [
                'name' => 'Arya Dwi Putra',
                'nip' => '0000.00000',
                'password' => Hash::make('password'),
            ]
        );

        $superAdminRole = Role::where('name', 'super-admin')->first();
        if ($superAdminRole) {
            $admin->syncRoles([$superAdminRole->name]);
        }
        $admin->syncPermissions(Permission::all());

        // 2. Setup Kepala Departemen
        $kepala = User::updateOrCreate(
            ['email' => 'kepala@gmail.com'],
            [
                'name' => 'Dr. Kepala Departemen',
                'nip' => '2000.11111',
                'password' => Hash::make('password'),
            ]
        );
        $kepalaRole = Role::where('name', 'kepala-departemen')->first();
        if ($kepalaRole) {
            $kepala->syncRoles([$kepalaRole->name]);
        }

        // 3. Setup Perawat
        $perawat = User::updateOrCreate(
            ['email' => 'perawat@gmail.com'],
            [
                'name' => 'Suster Perawat',
                'nip' => '3000.22222',
                'password' => Hash::make('password'),
            ]
        );
        $perawatRole = Role::where('name', 'perawat')->first();
        if ($perawatRole) {
            $perawat->syncRoles([$perawatRole->name]);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Output information to the console
        $users = User::count();
        $this->command->info('--- User Seeder Summary ---');
        $this->command->info('Total Users Created: ' . $users);
        $this->command->info('User seeding completed successfully!');
    }
}
