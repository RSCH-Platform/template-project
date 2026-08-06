<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Unit extends Model
{
    protected $fillable = [
        'unit_name', 'description',
    ];

    

    public function nurses(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'unit_user')
            ->withTimestamps();
    }

    public function demandSlots(): HasMany
    {
        return $this->hasMany(DemandSlot::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function eligibleStaff(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'staff_unit_eligibilities')
            ->withPivot('eligible', 'priority')
            ->withTimestamps();
    }

    
}
