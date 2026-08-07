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

    public function __construct()
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

        // create new role data
        $role = Role::create(['name' => $request->name]);

        // give permissions to role
        $role->givePermissionTo($request->selectedPermission);

        // render view
        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {

        // update role data
        $role->update(['name' => $request->name]);

        // sync role permissions
        $role->syncPermissions($request->selectedPermission);

        // render view
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // delete role data
        $role->delete();

        // render view
        return back();
    }
}
