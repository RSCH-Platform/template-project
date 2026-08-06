<?php

namespace App\Services;

use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ScheduleService
{
    /**
     * Query jadwal dengan filter role-based access dan date range.
     */
    public function query(array $filters = [])
    {
        $user  = Auth::user();
        $query = Schedule::with(['user', 'unit', 'shiftTemplate']);

        // Perawat hanya bisa lihat jadwal sendiri
        if ($user->hasRole('perawat')) {
            $query->where('user_id', $user->id);
        }

        if (isset($filters['unit_id'])) {
            $query->where('unit_id', $filters['unit_id']);
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('date', [$filters['start_date'], $filters['end_date']]);
        } else {
            $query->whereBetween('date', [
                Carbon::now()->subMonth()->startOfMonth(),
                Carbon::now()->endOfMonth(),
            ]);
        }

        return $query->orderBy('date')->orderBy('user_id')->get();
    }

    public function store(array $data): Schedule
    {
        return Schedule::create(array_merge($data, ['status' => 'draft']));
    }
    
    public function update(Schedule $schedule, array $data): bool
    {
        return $schedule->update($data);
    }

    public function publish(Schedule $schedule): void
    {
        $schedule->update(['status' => 'published']);
    }
}
