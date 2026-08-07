<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Services\UserService;
use App\Http\Requests\UserRequest;
use App\Models\Unit;
use App\Http\Resources\UserResource;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:users-access', only: ['index']),
            new Middleware('permission:users-create', only: ['create', 'store']),
            new Middleware('permission:users-update', only: ['edit', 'update']),
            new Middleware('permission:users-delete', only: ['destroy']),
        ];
    }

    public function __construct(private UserService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get all users data using Spatie QueryBuilder
        $query = QueryBuilder::for(User::class)
            ->allowedFilters('name', 'email', 'nip')
            ->allowedSorts('name', 'created_at')
            ->allowedIncludes('roles', 'units')
            ->with(['roles', 'units'])
            ->defaultSort('-created_at');
            
        $users = $this->dynamicPaginate($query);

        // render view
        return Inertia::render('Dashboard/Users/Index', [
            'users' => UserResource::collection($users),
            'loginType' => config('auth.login_type', 'email'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // get all role data
        $roles = Role::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
            
        $units = Unit::query()
            ->select('id', 'unit_name')
            ->orderBy('unit_name')
            ->get();

        // render view
        return Inertia::render('Dashboard/Users/Create', [
            'roles' => $roles,
            'units' => $units,
            'multipleDepartments' => config('auth.multiple_departments', false),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $this->service->store($request->validated(), $request->file('avatar'));

        // render view
        return back()->with('message', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // get all role data
        $roles = Role::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
            
        $units = Unit::query()
            ->select('id', 'unit_name')
            ->orderBy('unit_name')
            ->get();

        // load relationship
        $user->load([
            'roles' => fn ($query) => $query->select('id', 'name'), 
            'roles.permissions' => fn ($query) => $query->select('id', 'name'),
            'units' => fn ($query) => $query->select('units.id', 'unit_name')
        ]);

        // render view
        return Inertia::render('Dashboard/Users/Edit', [
            'roles' => $roles,
            'units' => $units,
            'user' => $user,
            'multipleDepartments' => config('auth.multiple_departments', false),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $this->service->update($user, $request->validated(), $request->file('avatar'));

        // render view
        return back()->with('message', 'Pengguna berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ids = explode(',', $id);
        
        User::whereIn('id', $ids)->delete();

        // render view
        return back();
    }
}
