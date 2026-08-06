<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('unit_id', 10)->unique();
            $table->string('unit_name');
            $table->boolean('is_clinical')->default(true);
            $table->boolean('is_24h')->default(false);
            $table->boolean('scheduling_enabled')->default(true);
            $table->unsignedTinyInteger('default_open_slot')->default(0);
            $table->unsignedTinyInteger('default_close_slot')->default(47);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
