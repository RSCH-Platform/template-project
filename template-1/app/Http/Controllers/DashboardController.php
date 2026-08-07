<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Unit;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Dashboard', [
            'chart_labels' => Inertia::defer(function () {
                return Role::withCount('users')->get()->pluck('name');
            }),
            'chart_data' => Inertia::defer(function () {
                return Role::withCount('users')->get()->pluck('users_count');
            }),
            'super_admin_data' => Inertia::defer(function () use ($user) {
                if ($user->hasPermissionTo('users-access') || $user->hasPermissionTo('roles-access')) {
                    return [
                        'total_users' => User::count(),
                        'total_roles' => Role::count(),
                        'total_units' => Unit::count(),
                        'recent_users' => User::with('roles')->latest()->take(5)->get(['id', 'name', 'email', 'avatar', 'created_at']),
                    ];
                }
                return null;
            }),
            'kepala_data' => Inertia::defer(function () use ($user) {
                if ($user->hasPermissionTo('units-access-owned')) {
                    $myUnits = $user->unitKerjas;
                    $unitIds = $myUnits->pluck('id');
                    
                    return [
                        'total_units' => $myUnits->count(),
                        'unit_names' => $myUnits->pluck('unit_name'),
                        'total_members' => User::whereHas('unitKerjas', function ($q) use ($unitIds) {
                            $q->whereIn('units.id', $unitIds);
                        })->count(),
                        'active_shifts' => 3, // Mock data
                        'present_today' => 15, // Mock data
                    ];
                }
                return null;
            }),
        ]);
    }
}
