<?php

namespace App\Jobs;

use App\Services\ScheduleOptimizerService;
use App\Models\Schedule;
use App\Models\User;
use App\Models\ShiftTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GenerateScheduleJob implements ShouldQueue
{
    use Queueable;

    public $timeout = 3600;

    public function __construct(
        public string $unitId,
        public string $dateFrom,
        public string $dateTo,
        public int $userId
    ) {}

    public function handle(ScheduleOptimizerService $optimizer): void
    {
        $cacheKey = "schedule_generation_{$this->unitId}_{$this->userId}";
        Cache::put($cacheKey, ['status' => 'processing', 'message' => 'Sedang memproses...']);

        try {
            $result = $optimizer->generate($this->unitId, $this->dateFrom, $this->dateTo);

            // Delete old drafts in this date range
            Schedule::where('unit_id', $this->unitId)
                ->whereBetween('date', [$this->dateFrom, $this->dateTo])
                ->where('status', 'draft')
                ->delete();

            // Cache staff mapping
            $staffCodes = collect($result['schedules'])->pluck('staff_id');
            $staffMapping = User::whereIn('staff_code', $staffCodes)->pluck('id', 'staff_code');
                
            $shiftMapping = ShiftTemplate::pluck('id', 'shift_code');
            $defaultShift = ShiftTemplate::first();

            $inserts = [];
            $now = now();
            foreach ($result['schedules'] as $entry) {
                if (isset($staffMapping[$entry['staff_id']])) {
                    if ($entry['shift_id'] === 'AUTO' || !isset($shiftMapping[$entry['shift_id']])) {
                        $start = $entry['start_slot'] ?? 0;
                        if ($start >= 8 && $start <= 22) {
                            $shiftId = $shiftMapping['MORNING'] ?? 2;
                        } elseif ($start >= 23 && $start <= 38) {
                            $shiftId = $shiftMapping['EVENING'] ?? 3;
                        } else {
                            $shiftId = $shiftMapping['NIGHT'] ?? 4;
                        }
                    } else {
                        $shiftId = $shiftMapping[$entry['shift_id']];
                    }
                    $inserts[] = [
                        'user_id' => $staffMapping[$entry['staff_id']],
                        'unit_id' => $this->unitId,
                        'shift_template_id' => $shiftId,
                        'date' => $entry['date'],
                        'start_slot' => $entry['start_slot'] ?? 0,
                        'end_slot' => $entry['end_slot'] ?? 47,
                        'hours' => $entry['hours'] ?? 0,
                        'status' => 'draft',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            foreach (array_chunk($inserts, 500) as $chunk) {
                Schedule::insert($chunk);
            }

            Cache::put($cacheKey, [
                'status' => 'done',
                'message' => 'Jadwal berhasil dibuat!',
                'meta' => $result['meta'] ?? []
            ], now()->addMinutes(10));
            
        } catch (\Exception $e) {
            Log::error('GenerateScheduleJob failed: ' . $e->getMessage());
            Cache::put($cacheKey, [
                'status' => 'failed',
                'message' => 'Gagal: ' . $e->getMessage()
            ], now()->addMinutes(10));
        }
    }
}
