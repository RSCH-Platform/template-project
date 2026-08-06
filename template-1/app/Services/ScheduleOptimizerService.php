<?php

namespace App\Services;

use App\Models\Unit;
use App\Models\User;
use App\Models\DemandSlot;
use App\Models\Preference;
use App\Models\Availability;
use App\Models\SchedulingRule;
use App\Models\ShiftTemplate;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ScheduleOptimizerService
{
    public function generate(string $unitId, string $dateFrom, string $dateTo): array
    {
        $unit = Unit::findOrFail($unitId);

        // 1. Kumpulkan staff
        $staff = User::whereHas('eligibleUnits', fn($q) => $q->where('units.id', $unit->id))
            ->with(['skills'])
            ->get();

        // 2. Build payload
        $payload = [
            'unit_id' => $unit->unit_id,
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'staff' => $this->formatStaff($staff),
            'demand' => $this->formatDemand($unit, $dateFrom, $dateTo),
            'preferences' => $this->formatPreferences($staff, $dateFrom, $dateTo),
            'availability' => $this->formatAvailability($staff, $dateFrom, $dateTo),
            'rules' => $this->formatRules(),
            'shift_templates' => $this->formatShiftTemplates(),
            'nsga2_config' => [
                'population_size' => 50,
                'generations' => 50,
                'seed' => 42,
            ],
        ];

        // 3. Kirim ke Python NSGA-II API
        $url = config('services.nsga2.url', 'http://127.0.0.1:8001') . '/api/optimize';
        
        $response = Http::timeout(3600)->post($url, $payload);

        if ($response->failed()) {
            throw new \RuntimeException('NSGA-II API error: ' . $response->body());
        }

        return $response->json();
    }

    private function formatStaff($staff): array
    {
        return $staff->map(fn($s) => [
            'staff_id' => $s->staff_code,
            'profession_code' => 'NURSE',
            'employment_type' => 'FULL_TIME',
            'target_hours_per_week' => (float)($s->target_hours_per_week ?? 40),
            'max_hours_per_day' => (float)($s->max_hours_per_day ?? 12),
            'max_hours_per_week' => (float)($s->max_hours_per_week ?? 48),
            'min_rest_hours' => (float)($s->min_rest_hours ?? 10),
            'max_consecutive_days' => (int)($s->max_consecutive_days ?? 5),
            'max_night_shifts_per_week' => (int)($s->max_night_shifts_per_week ?? 3),
            'hourly_cost' => (float)($s->hourly_cost ?? 1.0),
            'is_supervisor' => (bool)$s->is_supervisor,
            'skills' => $s->skills->map(fn($skill) => [
                'skill_code' => $skill->skill_code,
                'proficiency_level' => 1,
                'valid_from' => null,
                'valid_until' => null,
            ])->toArray()
        ])->toArray();
    }

    private function formatDemand(Unit $unit, string $dateFrom, string $dateTo): array
    {
        return DemandSlot::whereBetween('date', [$dateFrom, $dateTo])
            ->where('unit_id', $unit->id)
            ->get()
            ->map(fn($d) => [
                'date' => $d->date->format('Y-m-d'),
                'slot' => $d->slot,
                'skill_code' => $d->skill_code,
                'min_staff' => $d->min_staff,
                'ideal_staff' => $d->ideal_staff,
                'need_supervisor' => $d->need_supervisor,
            ])->toArray();
    }

    private function formatPreferences($staff, string $dateFrom, string $dateTo): array
    {
        $staffIds = $staff->pluck('id')->toArray();
        return Preference::whereBetween('date', [$dateFrom, $dateTo])
            ->whereIn('user_id', $staffIds)
            ->with(['user', 'shiftTemplate'])
            ->get()
            ->map(fn($p) => [
                'staff_id' => $p->user->staff_id,
                'date' => $p->date->format('Y-m-d'),
                'shift_id' => $p->shiftTemplate ? $p->shiftTemplate->shift_code : null,
                'preference_type' => $p->preference_type,
                'weight' => (float)$p->weight,
            ])->toArray();
    }

    private function formatAvailability($staff, string $dateFrom, string $dateTo): array
    {
        $staffIds = $staff->pluck('id')->toArray();
        return Availability::whereBetween('date', [$dateFrom, $dateTo])
            ->whereIn('user_id', $staffIds)
            ->with(['user'])
            ->get()
            ->map(fn($a) => [
                'staff_id' => $a->user->staff_id,
                'date' => $a->date->format('Y-m-d'),
                'start_slot' => $a->start_slot,
                'end_slot' => $a->end_slot,
                'status' => $a->status,
            ])->toArray();
    }

    private function formatRules(): array
    {
        return SchedulingRule::all()->map(fn($r) => [
            'rule_code' => $r->rule_name,
            'constraint_type' => $r->constraint_type,
            'value_int' => (int)$r->value,
            'value_float' => (float)$r->value,
            'is_active' => true,
        ])->toArray();
    }

    private function formatShiftTemplates(): array
    {
        return ShiftTemplate::all()->map(fn($s) => [
            'shift_code' => $s->shift_code,
            'shift_name' => $s->shift_name,
            'shift_type' => $s->shift_type,
            'start_slot' => $s->start_slot,
            'end_slot' => $s->end_slot,
            'duration_slots' => $s->duration_slots,
            'crosses_midnight' => (bool)$s->crosses_midnight,
            'is_night_shift' => (bool)$s->is_night_shift,
        ])->toArray();
    }
}
