<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Requests\UnitRequest;
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
        $query = $this->applySearch($query, ['unit_name']);
        
        $user = auth()->user();
        if (!$user->hasPermissionTo('units-access-all')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        
        $units = $this->dynamicPaginate($query);
                    
        $all_users = \App\Models\User::select('id', 'name', 'email', 'avatar', 'nip')->with('roles:id,name')->get();

        return Inertia::render('Units/Index', [
            'units' => $units,
            'all_users' => $all_users
        ]);
    }

    public function syncUsers(Request $request, Unit $unit)
    {
        $this->authorize('update', $unit);
        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $unit->users()->sync($validated['user_ids'] ?? []);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Pengguna departemen berhasil diperbarui.',
                'user_ids' => $validated['user_ids'] ?? [],
            ]);
        }
        return back()->with('message', 'Pengguna departemen berhasil diperbarui.');
    }


    public function create()
    {
        return Inertia::render('Units/Create');
    }

    public function edit(Unit $unit)
    {
        $this->authorize('update', $unit);
        return Inertia::render('Units/Edit', [
            'unit' => $unit
        ]);
    }

    public function store(UnitRequest $request)
    {
        Unit::create($request->validated());
        return back()->with('message', 'Departemen berhasil ditambahkan.');
    }

    public function update(UnitRequest $request, Unit $unit)
    {
        $this->authorize('update', $unit);
        $unit->update($request->validated());
        return back()->with('message', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $this->authorize('delete', $unit);
        $unit->delete();
        return back()->with('message', 'Departemen berhasil dihapus.');
    }
}
