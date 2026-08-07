<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Middleware\RedirectIfSsoDisabled;
use Juniyasyos\IamClient\Http\Controllers\SsoCallbackController;
use Juniyasyos\IamClient\Http\Controllers\SsoLoginRedirectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    
    $ssoEnabled = config('iam.enabled', false) || env('USE_SSO', false);
    return $ssoEnabled 
        ? redirect()->route('sso.login') 
        : redirect()->route('login.form');
});

// Unified login entrypoint
Route::get('/login', function() {
    $ssoEnabled = config('iam.enabled', false) || env('USE_SSO', false);
    return $ssoEnabled 
        ? redirect()->route('sso.login') 
        : redirect()->route('login.form');
})->name('login');

// SSO Routes (hanya aktif saat IAM_ENABLED=true)
Route::middleware([RedirectIfSsoDisabled::class])->group(function () {
    Route::get('/sso/login', SsoLoginRedirectController::class)->name('sso.login');
    Route::get('/sso/callback', SsoCallbackController::class)->name('sso.callback');
});

// SSO-aware Logout
Route::post('/logout', LogoutController::class)->name('logout');

Route::get('/dashboard', function () {
    $user = auth()->user();

    // Default for chart
    $roles = \Spatie\Permission\Models\Role::withCount('users')->get();
    $chartLabels = $roles->pluck('name');
    $chartData = $roles->pluck('users_count');

    // Data for Super Admin
    $superAdminData = null;
    if ($user->hasPermissionTo('users-access') || $user->hasPermissionTo('roles-access')) {
        $superAdminData = [
            'total_users' => \App\Models\User::count(),
            'total_roles' => \Spatie\Permission\Models\Role::count(),
            'total_units' => \App\Models\Unit::count(),
            'recent_users' => \App\Models\User::with('roles')->latest()->take(5)->get(['id', 'name', 'email', 'avatar', 'created_at']),
        ];
    }

    // Data for Kepala Ruangan
    $kepalaData = null;
    if ($user->hasPermissionTo('units-access-owned')) {
        $myUnits = $user->unitKerjas;
        $unitIds = $myUnits->pluck('id');
        
        $kepalaData = [
            'total_units' => $myUnits->count(),
            'unit_names' => $myUnits->pluck('unit_name'),
            'total_members' => \App\Models\User::whereHas('unitKerjas', function ($q) use ($unitIds) {
                $q->whereIn('units.id', $unitIds);
            })->count(),
            'active_shifts' => 3, // Mock data
            'present_today' => 15, // Mock data
        ];
    }

    return Inertia::render('Dashboard', [
        'chart_labels' => $chartLabels,
        'chart_data' => $chartData,
        'super_admin_data' => $superAdminData,
        'kepala_data' => $kepalaData,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group(['prefix' => 'dashboard'], function () {
        Route::resource('/roles', \App\Http\Controllers\RoleController::class);
        Route::resource('/users', \App\Http\Controllers\UserController::class);

        Route::impersonate();

        // Units
        Route::post('/units/{unit}/users', [\App\Http\Controllers\UnitController::class, 'syncUsers'])->name('units.users.sync');
        Route::resource('/units', \App\Http\Controllers\UnitController::class);
    });
});

require __DIR__.'/auth.php';
