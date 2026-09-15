<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->date('date_of_birth')->nullable();
            $table->string('phone')->nullable();
            $table->string('street_address')->nullable();
            $table->string('city')->nullable();
            $table->string('country', 10)->nullable();
            $table->string('post_code')->nullable();
            $table->timestamp('terms_accepted_at')->nullable();
            
            // RPG Stats & Currency
            $table->unsignedBigInteger('coins')->default(25000);
            $table->unsignedBigInteger('crystals')->default(1500);
            $table->string('selected_hero_class')->default('knight'); // knight, rogue, mage, hunter, berserker, cleric
            $table->string('equipped_skin')->default('default');
            $table->unsignedInteger('stat_hp_level')->default(1);
            $table->unsignedInteger('stat_damage_level')->default(1);
            $table->unsignedInteger('stat_speed_level')->default(1);
            $table->unsignedInteger('matches_played')->default(0);
            $table->unsignedInteger('total_kills')->default(0);
            $table->unsignedInteger('high_score')->default(0);

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
