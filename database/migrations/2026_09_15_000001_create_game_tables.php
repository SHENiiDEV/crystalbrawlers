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
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('hero_class'); // knight, rogue, mage, hunter, berserker, cleric, all
            $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price_coins')->default(0);
            $table->unsignedBigInteger('price_crystals')->default(0);
            $table->string('accent_color')->default('#06b6d4');
            $table->string('weapon_type')->default('Sword');
            $table->json('bonus_stats')->nullable(); // e.g. {"damage": 5, "speed": 2}
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        Schema::create('user_skins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skin_id')->constrained()->cascadeOnDelete();
            $table->timestamp('acquired_at')->useCurrent();
            $table->unique(['user_id', 'skin_id']);
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Patch Notes'); // Patch Notes, Announcements, Community, Balance
            $table->text('summary');
            $table->longText('content');
            $table->string('badge_color')->default('emerald');
            $table->string('version_tag')->nullable(); // e.g. "v1.4.0"
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('match_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('hero_class');
            $table->unsignedInteger('score')->default(0);
            $table->unsignedInteger('kills')->default(0);
            $table->unsignedInteger('coins_earned')->default(0);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->string('result')->default('completed'); // victory, defeat, completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_histories');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('user_skins');
        Schema::dropIfExists('skins');
    }
};
