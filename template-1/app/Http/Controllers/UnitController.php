<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Requests\UnitRequest;
use App\Http\Requests\SyncUnitUsersRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Resources\UnitResource;
use App\Http\Resources\UserResource;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Services\UnitService;

class UnitController extends Controller implements HasMiddleware
{
    public function __construct(private UnitService $service)
    {
    }
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
        $query = QueryBuilder::for(Unit::class)
            ->allowedFilters('unit_name')
            ->allowedSorts('unit_name', 'created_at')
            ->allowedIncludes('users')
            ->with('users:id,name,email,avatar,nip')
            ->withCount('users')
            ->defaultSort('unit_name');
        
        $user = auth()->user();
        if (!$user->hasPermissionTo('units-access-all')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        
        $units = $this->dynamicPaginate($query);

        return Inertia::render('Units/Index', [
            'units' => UnitResource::collection($units),
            'all_users' => Inertia::defer(fn () => UserResource::collection(\App\Models\User::select('id', 'name', 'email', 'avatar', 'nip')->with('roles:id,name')->get()))
        ]);
    }

    public function syncUsers(SyncUnitUsersRequest $request, Unit $unit)
    {
        $this->authorize('update', $unit);
        $validated = $request->validated();

        $this->service->syncUsers($unit, $validated['user_ids'] ?? []);

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
        $this->service->store($request->validated());
        return back()->with('message', 'Departemen berhasil ditambahkan.');
    }

    public function update(UnitRequest $request, Unit $unit)
    {
        $this->authorize('update', $unit);
        $this->service->update($unit, $request->validated());
        return back()->with('message', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $this->authorize('delete', $unit);
        $this->service->destroy([$unit->id]);

        return back()->with('message', 'Departemen berhasil dihapus.');
    }
}
