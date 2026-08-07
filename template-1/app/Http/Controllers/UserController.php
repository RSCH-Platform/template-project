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

class UserController extends Controller
{
    public function __construct(private UserService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get all users data
        $query = User::query()
            ->with(['roles', 'units']);
        $query = $this->applySearch($query, ['name'])
            ->select('id', 'name', 'avatar', 'email', 'nip')
            ->latest();
            
        $users = $this->dynamicPaginate($query);

        // render view
        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users,
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
        return to_route('users.index');
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
        return to_route('users.index');
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
