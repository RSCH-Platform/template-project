<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public function store(array $data, ?UploadedFile $avatar = null): User
    {
        $avatarPath = null;
        if ($avatar) {
            $avatarPath = $avatar->store('avatars', 'public');
        }

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'nip'      => $data['nip'] ?? null,
            'password' => bcrypt($data['password']),
            'avatar'   => $avatarPath,
        ]);

        $user->assignRole($data['selectedRoles']);
        
        if (isset($data['selectedUnits'])) {
            $user->units()->sync($data['selectedUnits']);
        }

        return $user;
    }

    public function update(User $user, array $data, ?UploadedFile $avatar = null): User
    {
        $avatarPath = $user->getRawOriginal('avatar');

        if ($avatar) {
            if ($avatarPath) {
                Storage::disk('public')->delete($avatarPath);
            }
            $avatarPath = $avatar->store('avatars', 'public');
        }

        if (!empty($data['password'])) {
            $user->update(['password' => bcrypt($data['password'])]);
        }

        $user->update([
            'name'   => $data['name'],
            'email'  => $data['email'],
            'nip'    => $data['nip'] ?? null,
            'avatar' => $avatarPath,
        ]);

        $user->syncRoles($data['selectedRoles']);

        if (isset($data['selectedUnits'])) {
            $user->units()->sync($data['selectedUnits']);
        } else {
            $user->units()->sync([]);
        }

        return $user;
    }
}
