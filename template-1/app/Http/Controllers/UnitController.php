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
            new Middleware('permission:units-access', only: ['index']),
            new Middleware('permission:units-create', only: ['create', 'store']),
            new Middleware('permission:units-update', only: ['edit', 'update']),
            new Middleware('permission:units-delete', only: ['destroy']),
        ];
    }

    public function index()
    {
        $units = Unit::with('users:id,name,email,avatar,nip')
                    ->withCount('users')
                    ->orderBy('unit_id')
                    ->paginate(10);
                    
        $all_users = \App\Models\User::select('id', 'name', 'email', 'avatar', 'nip')->get();

        return Inertia::render('Units/Index', [
            'units' => $units,
            'all_users' => $all_users
        ]);
    }

    public function syncUsers(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $unit->users()->sync($validated['user_ids'] ?? []);

        return back()->with('message', 'Pengguna departemen berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|string|max:10|unique:units',
            'unit_name' => 'required|string|max:255',
            'is_clinical' => 'boolean',
            'is_24h' => 'boolean',
            'scheduling_enabled' => 'boolean',
            'default_open_slot' => 'integer|min:0|max:47',
            'default_close_slot' => 'integer|min:0|max:47',
            'description' => 'nullable|string',
        ]);

        Unit::create($validated);
        return redirect()->route('units.index')->with('message', 'Departemen berhasil ditambahkan.');
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'unit_id' => 'required|string|max:10|unique:units,unit_id,' . $unit->id,
            'unit_name' => 'required|string|max:255',
            'is_clinical' => 'boolean',
            'is_24h' => 'boolean',
            'scheduling_enabled' => 'boolean',
            'default_open_slot' => 'integer|min:0|max:47',
            'default_close_slot' => 'integer|min:0|max:47',
            'description' => 'nullable|string',
        ]);

        $unit->update($validated);
        return redirect()->route('units.index')->with('message', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();
        return redirect()->route('units.index')->with('message', 'Departemen berhasil dihapus.');
    }
}
