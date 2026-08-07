<?php

namespace App\Models;

use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Lab404\Impersonate\Models\Impersonate;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\UserObserver;

#[ObservedBy(UserObserver::class)]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, Impersonate;
    use HasRoles {
        syncRoles as protected traitSyncRoles;
    }
    use MustVerifyEmailTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'nip',
        'email',
        'password',
        'avatar',
        'iam_id',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'string',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'unit_user')
            ->withTimestamps();
    }

    public function unitKerjas(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'unit_user', 'user_id', 'unit_id')
            ->withTimestamps();
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class);
    }

    public function preferences(): HasMany
    {
        return $this->hasMany(Preference::class);
    }

    public function eligibleUnits(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'staff_unit_eligibilities')
            ->withPivot('eligible', 'priority')
            ->withTimestamps();
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
            ->withPivot('proficiency_level', 'valid_from', 'valid_until')
            ->withTimestamps();
    }

    public function isNurse(): bool
    {
        return $this->profession_code === 'NURSE';
    }



    /**
     * Accessor for avatar URL.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (! $value) {
                    return null;
                }

                if (
                    str_starts_with($value, 'http://') ||
                    str_starts_with($value, 'https://') ||
                    str_starts_with($value, '/storage/')
                ) {
                    return $value;
                }

                return asset('storage/'.ltrim($value, '/'));
            }
        );
    }

    /**
     *  get all permissions users
     */
    public function getPermissions()
    {
        return $this->getAllPermissions()->mapWithKeys(function ($permission) {
            return [
                $permission['name'] => true,
            ];
        });
    }



    /**
     * Determine if the user has verified their email address.
     *
     * @return bool
     */
    public function hasVerifiedEmail()
    {
        if (app()->environment(['local', 'dev'])) {
            return true;
        }

        return ! is_null($this->email_verified_at);
    }

    public function canImpersonate()
    {
        return $this->hasPermissionTo('impersonate');
    }

    public function canBeImpersonated()
    {
        return ! $this->hasPermissionTo('impersonate');
    }

    /**
     * Override syncRoles to auto-create missing roles from SSO push
     */
    public function syncRoles(...$roles)
    {
        $roleNames = collect($roles)->flatten()->filter(fn($role) => is_string($role));
        
        foreach ($roleNames as $roleName) {
            \Spatie\Permission\Models\Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => $this->getDefaultGuardName()
            ]);
        }

        return $this->traitSyncRoles(...$roles);
    }
}
