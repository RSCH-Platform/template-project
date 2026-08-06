<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['unit_id' => 'ICU', 'unit_name' => 'ICU', 'is_clinical' => true, 'is_24h' => true, 'scheduling_enabled' => true, 'default_open_slot' => 0, 'default_close_slot' => 47],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['unit_id' => $unit['unit_id']],
                $unit
            );
        }
    }
}
