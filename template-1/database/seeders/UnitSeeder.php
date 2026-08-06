<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['unit_name' => 'ICU'],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['unit_name' => $unit['unit_name']],
                $unit
            );
        }
    }
}
