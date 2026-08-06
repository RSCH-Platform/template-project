<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Unit extends Model
{
    protected $fillable = [
        'unit_id', 'unit_name', 'is_clinical',
        'is_24h', 'scheduling_enabled',
        'default_open_slot', 'default_close_slot', 'description',
    ];

    protected $casts = [
        'is_clinical' => 'boolean',
        'is_24h' => 'boolean',
        'scheduling_enabled' => 'boolean',
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

    /**
     * Convert slot number to HH:MM time string.
     */
    public static function slotToTime(int $slot): string
    {
        $minutes = $slot * 30;
        return sprintf('%02d:%02d', intdiv($minutes, 60), $minutes % 60);
    }

    public function getOpenTimeAttribute(): string
    {
        return self::slotToTime($this->default_open_slot);
    }

    public function getCloseTimeAttribute(): string
    {
        return self::slotToTime($this->default_close_slot);
    }
}
