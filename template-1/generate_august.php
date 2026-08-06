<?php
use App\Models\Unit;
use App\Models\DemandSlot;
use App\Jobs\GenerateScheduleJob;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

$units = Unit::all();
$months = [
    ['2026-08-01', '2026-08-31'],
];
$userId = \App\Models\User::first()->id ?? 1;

foreach ($units as $unit) {
    foreach ($months as $month) {
        $period = CarbonPeriod::create($month[0], $month[1]);
        
        echo "Generating demand for Unit {$unit->id} - {$month[0]} to {$month[1]}...\n";
        $inserts = [];
        foreach ($period as $date) {
            $dateStr = $date->format('Y-m-d');
            
            if (DemandSlot::where('unit_id', $unit->id)->where('date', $dateStr)->exists()) {
                continue;
            }
            
            for ($slot = 0; $slot < 48; $slot++) {
                $min = 1;
                $ideal = 2;
                if ($slot >= 16 && $slot < 32) { // Day
                    $min = 2;
                    $ideal = 3;
                }
                
                $inserts[] = [
                    'unit_id' => $unit->id,
                    'date' => $dateStr,
                    'slot' => $slot,
                    'skill_code' => 'L2',
                    'min_staff' => $min,
                    'ideal_staff' => $ideal,
                    'need_supervisor' => ($slot >= 16 && $slot <= 32),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            if (count($inserts) >= 500) {
                DemandSlot::insert($inserts);
                $inserts = [];
            }
        }
        if (count($inserts) > 0) {
            DemandSlot::insert($inserts);
        }
        
        echo "Dispatching Job for Unit {$unit->id} - {$month[0]} to {$month[1]}...\n";
        GenerateScheduleJob::dispatch($unit->id, $month[0], $month[1], $userId);
    }
}
echo "August done!\n";
