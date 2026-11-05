<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\LeaderboardSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaderboardSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_populates_the_leaderboard_without_creating_demo_login_or_changing_existing_players(): void
    {
        $existingPlayer = User::factory()->create(['high_score' => 15000]);
        $legacyProfile = User::factory()->create([
            'email' => 'leaderboard-bot-1@example.invalid',
            'name' => 'VortexBlade (bot)',
            'high_score' => 9999,
        ]);

        $this->seed(LeaderboardSeeder::class);
        $this->seed(LeaderboardSeeder::class);

        $this->assertSame(31, User::count());
        $this->assertSame(15000, $existingPlayer->fresh()->high_score);
        $this->assertSame('VortexBlade', $legacyProfile->fresh()->name);
        $this->assertSame(9999, $legacyProfile->fresh()->high_score);
        $this->assertDatabaseMissing('users', ['email' => 'player@crystalbrawlers.com']);
        $this->assertSame(0, User::where('name', 'like', '%(bot)%')->count());

        $response = $this->get('/leaderboard');
        $response->assertOk();
        $response->assertSee('Leaderboard');
        $this->assertSame(30, User::where('email', 'like', 'leaderboard-bot-%@example.invalid')->count());
    }
}
