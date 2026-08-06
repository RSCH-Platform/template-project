<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Unit;
use App\Models\User;
use App\Models\DemandSlot;
use App\Models\LeaveRequest;
use App\Jobs\GenerateScheduleJob;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

$units = Unit::all();
$users = User::where('role', '!=', 'admin')->get();
$monthStart = '2026-07-01';
$monthEnd = '2026-07-31';
$period = CarbonPeriod::create($monthStart, $monthEnd);
$userId = User::first()->id ?? 1;

echo "Cleaning up old leave requests for July...\n";
LeaveRequest::whereBetween('leave_date', [$monthStart, $monthEnd])->delete();

echo "Generating dummy LeaveRequests for July...\n";

// Generate random leaves for some users
$leaveTypes = ['CUTI_TAHUNAN', 'CUTI_SAKIT', 'CUTI_DARURAT'];
$leaveCounts = 0;

foreach ($users as $index => $user) {
    // 30% chance for a user to take leave
    if (rand(1, 100) <= 30) {
        $startDate = Carbon::parse($monthStart)->addDays(rand(0, 25));
        $leaveDays = rand(1, 3);
        $type = $leaveTypes[array_rand($leaveTypes)];
        
        for ($i = 0; $i < $leaveDays; $i++) {
            $leaveDate = $startDate->copy()->addDays($i);
            LeaveRequest::create([
                'user_id' => $user->id,
                'leave_date' => $leaveDate->format('Y-m-d'),
                'leave_type' => $type,
                'reason' => "Dummy reason for $type generated script",
                'status' => 'approved',
                'reviewed_by' => $userId,
                'reviewed_at' => now(),
            ]);
            $leaveCounts++;
        }
    }
}
echo "Generated $leaveCounts leave requests for July.\n";

foreach ($units as $unit) {
    echo "Generating demand for Unit {$unit->id} - {$monthStart} to {$monthEnd}...\n";
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
    
    echo "Dispatching Job for Unit {$unit->id} - {$monthStart} to {$monthEnd}...\n";
    GenerateScheduleJob::dispatch($unit->id, $monthStart, $monthEnd, $userId);
}
echo "July with dummy leaves generated!\n";
