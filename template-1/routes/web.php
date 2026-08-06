<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    
    // For Chart.js - count users by role
    $roles = \Spatie\Permission\Models\Role::withCount('users')->get();
    $chartLabels = $roles->pluck('name');
    $chartData = $roles->pluck('users_count');

    return Inertia::render('Dashboard', [
        'total_users' => \App\Models\User::count(),
        'chart_labels' => $chartLabels,
        'chart_data' => $chartData,
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
