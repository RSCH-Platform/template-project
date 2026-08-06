<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add iam_id and status to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('iam_id')->nullable()->unique()->after('id');
            $table->enum('status', ['active', 'inactive', 'suspended'])
                  ->default('active')->after('avatar');
        });

        // 2. Make password nullable
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();
        });

        // 3. Create iam_settings table
        Schema::create('iam_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('sync_users')->default(true)
                  ->comment('Enable or disable the `/api/iam/sync-users` endpoint');
            $table->timestamps();
        });

        // 4. Seed default iam_settings
        DB::table('iam_settings')->insert([
            'sync_users' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iam_settings');

        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable(false)->change();
            $table->dropColumn(['iam_id', 'status']);
        });
    }
};
