<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Http\Resources\RoleResource;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Services\RoleService;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:roles-access', only: ['index']),
            new Middleware('permission:roles-create', only: ['create', 'store']),
            new Middleware('permission:roles-update', only: ['edit', 'update']),
            new Middleware('permission:roles-delete', only: ['destroy']),
        ];
    }

    public function __construct(private RoleService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // get all role data using Spatie QueryBuilder
        $query = QueryBuilder::for(Role::class)
            ->allowedFilters('name')
            ->allowedSorts('name', 'created_at')
            ->allowedIncludes('permissions')
            ->with('permissions')
            ->defaultSort('-created_at');
            
        $roles = $this->dynamicPaginate($query);

        // render view
        return Inertia::render('Dashboard/Roles/Index', [
            'roles' => RoleResource::collection($roles),
            'permissions' => Inertia::defer(fn () => Permission::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->service->store($request->validated());
        
        return back()->with('message', 'Akses Group berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->service->update($role, $request->validated());

        return back()->with('message', 'Akses Group berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ids = explode(',', $id);
        
        $this->service->destroy($ids);

        // render view
        return back();
    }
}
