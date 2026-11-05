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

        $this->seed(LeaderboardSeeder::class);
        $this->seed(LeaderboardSeeder::class);

        $this->assertSame(6, User::count());
        $this->assertSame(15000, $existingPlayer->fresh()->high_score);
        $this->assertDatabaseMissing('users', ['email' => 'player@crystalbrawlers.com']);

        $response = $this->get('/leaderboard');
        $response->assertOk();
        $response->assertSee('Leaderboard');
        $this->assertSame(5, User::where('email', 'like', 'leaderboard-bot-%@example.invalid')->count());
    }
}
