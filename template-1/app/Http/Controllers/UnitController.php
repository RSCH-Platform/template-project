<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UnitController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:units-access-all|units-access-owned', only: ['index']),
            new Middleware('permission:units-create-all', only: ['create', 'store']),
            new Middleware('permission:units-update-all|units-update-owned', only: ['edit', 'update', 'syncUsers']),
            new Middleware('permission:units-delete-all|units-delete-owned', only: ['destroy']),
        ];
    }

    public function index()
    {
        $query = Unit::with('users:id,name,email,avatar,nip')->withCount('users')->orderBy('unit_name');
        
        $user = auth()->user();
        if (!$user->hasPermissionTo('units-access-all')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        
        $units = $this->dynamicPaginate($query);
                    
        $all_users = \App\Models\User::select('id', 'name', 'email', 'avatar', 'nip')->get();

        return Inertia::render('Units/Index', [
            'units' => $units,
            'all_users' => $all_users
        ]);
    }

    public function syncUsers(Request $request, Unit $unit)
    {
        $user = auth()->user();
        abort_if(!$user->hasPermissionTo('units-update-all') && !$unit->users->contains('id', $user->id), 403, 'Unauthorized.');
        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $unit->users()->sync($validated['user_ids'] ?? []);

        return back()->with('message', 'Pengguna departemen berhasil diperbarui.');
    }


    public function create()
    {
        return Inertia::render('Units/Create');
    }

    public function edit(Unit $unit)
    {
        $user = auth()->user();
        abort_if(!$user->hasPermissionTo('units-update-all') && !$unit->users->contains('id', $user->id), 403, 'Unauthorized.');
        return Inertia::render('Units/Edit', [
            'unit' => $unit
        ]);
    }

    public function store(Request $request)

    {
        $validated = $request->validate([
            'unit_name' => 'required|string|max:255',
            
            'description' => 'nullable|string',
        ]);

        Unit::create($validated);
        return redirect()->route('units.index')->with('message', 'Departemen berhasil ditambahkan.');
    }

    public function update(Request $request, Unit $unit)
    {
        $user = auth()->user();
        abort_if(!$user->hasPermissionTo('units-update-all') && !$unit->users->contains('id', $user->id), 403, 'Unauthorized.');
        $validated = $request->validate([
            'unit_name' => 'required|string|max:255',
            
            'description' => 'nullable|string',
        ]);

        $unit->update($validated);
        return redirect()->route('units.index')->with('message', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $user = auth()->user();
        abort_if(!$user->hasPermissionTo('units-delete-all') && !$unit->users->contains('id', $user->id), 403, 'Unauthorized.');
        $unit->delete();
        return redirect()->route('units.index')->with('message', 'Departemen berhasil dihapus.');
    }
}
