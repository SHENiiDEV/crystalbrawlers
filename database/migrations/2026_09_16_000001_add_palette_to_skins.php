<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('skins', function (Blueprint $table) {
            // Visual palette used by the canvas renderer (body, cape, trim, glow, aura...)
            $table->json('palette')->nullable()->after('accent_color');
        });
    }

    public function down(): void
    {
        Schema::table('skins', function (Blueprint $table) {
            $table->dropColumn('palette');
        });
    }
};
