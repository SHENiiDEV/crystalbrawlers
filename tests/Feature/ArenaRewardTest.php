<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArenaRewardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_arena_reward_api_rejects_invalid_signature(): void
    {
        $user = User::where('email', 'player@crystalbrawlers.com')->first();

        $response = $this->postJson('/api/arena/reward', [
            'user_id' => $user->id,
            'score' => 500,
            'kills' => 5,
            'coins_earned' => 50,
            'duration_seconds' => 60,
            'hero_class' => 'knight',
            'result' => 'victory',
        ], [
            'X-Arena-Signature' => 'invalid_tampered_signature',
        ]);

        $response->assertStatus(403);
    }

    public function test_arena_reward_api_successfully_credits_coins_with_valid_hmac(): void
    {
        $user = User::where('email', 'player@crystalbrawlers.com')->first();
        $initialCoins = $user->coins;
        $initialKills = $user->total_kills;

        $score = 1200;
        $kills = 8;
        $coinsEarned = 150;
        $duration = 90;

        $secret = env('ARENA_SERVER_SECRET', 'crystal-brawlers-super-secret-key');
        $dataToSign = "{$user->id}:{$score}:{$kills}:{$coinsEarned}:{$duration}";
        $validSignature = hash_hmac('sha256', $dataToSign, $secret);

        $response = $this->postJson('/api/arena/reward', [
            'user_id' => $user->id,
            'score' => $score,
            'kills' => $kills,
            'coins_earned' => $coinsEarned,
            'duration_seconds' => $duration,
            'hero_class' => 'knight',
            'result' => 'victory',
        ], [
            'X-Arena-Signature' => $validSignature,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $user->refresh();
        $this->assertEquals($initialCoins + $coinsEarned, $user->coins);
        $this->assertEquals($initialKills + $kills, $user->total_kills);
        $this->assertDatabaseHas('match_histories', [
            'user_id' => $user->id,
            'score' => $score,
            'kills' => $kills,
            'coins_earned' => $coinsEarned,
        ]);
    }
}
