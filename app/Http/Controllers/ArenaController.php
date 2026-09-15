<?php

namespace App\Http\Controllers;

use App\Models\MatchHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArenaController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $heroClasses = HeroesController::getHeroClasses();
        $activeHero = collect($heroClasses)->firstWhere('id', $user->selected_hero_class) ?? $heroClasses[0];

        // Calculate dynamic in-game stats based on base class stats + level upgrades
        $calculatedHp = $activeHero['stats']['hp'] + (($user->stat_hp_level - 1) * 20);
        $calculatedDamage = $activeHero['stats']['damage'] + (($user->stat_damage_level - 1) * 15);
        $calculatedSpeed = $activeHero['stats']['speed'] + (($user->stat_speed_level - 1) * 5);

        // Generate HMAC auth token for the Node.js websocket handshake
        $secret = env('ARENA_SERVER_SECRET', 'crystal-brawlers-super-secret-key');
        $payload = json_encode([
            'userId' => $user->id,
            'userName' => $user->name,
            'heroClass' => $user->selected_hero_class,
            'skin' => $user->equipped_skin ?? 'default-knight',
            'hp' => $calculatedHp,
            'damage' => $calculatedDamage,
            'speed' => $calculatedSpeed,
            'timestamp' => time(),
        ]);
        $signature = hash_hmac('sha256', $payload, $secret);

        return Inertia::render('Arena', [
            'hero' => $activeHero,
            'calculatedStats' => [
                'hp' => $calculatedHp,
                'damage' => $calculatedDamage,
                'speed' => $calculatedSpeed,
            ],
            'playerSession' => [
                'userId' => $user->id,
                'userName' => $user->name,
                'heroClass' => $user->selected_hero_class,
                'skin' => $user->equipped_skin ?? 'default-knight',
                'payload' => base64_encode($payload),
                'signature' => $signature,
            ],
            'wsUrl' => env('ARENA_WS_URL', 'http://localhost:3008'),
        ]);
    }

    /**
     * Authenticated browser client endpoint called when a match finishes or player exits.
     */
    public function finishMatch(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'score' => ['required', 'integer', 'min:0'],
            'kills' => ['required', 'integer', 'min:0'],
            'coins_earned' => ['required', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'hero_class' => ['nullable', 'string'],
            'result' => ['nullable', 'string'],
        ]);

        $coinsEarned = (int) $validated['coins_earned'];
        $score = (int) $validated['score'];
        $kills = (int) $validated['kills'];
        $duration = (int) ($validated['duration_seconds'] ?? 0);
        $heroClass = $validated['hero_class'] ?? $user->selected_hero_class ?? 'knight';
        $result = $validated['result'] ?? 'completed';

        // Apply coin rewards & stats to user profile
        $user->increment('coins', $coinsEarned);
        $user->increment('matches_played', 1);
        $user->increment('total_kills', $kills);
        if ($score > $user->high_score) {
            $user->high_score = $score;
            $user->save();
        }

        // Record history
        MatchHistory::create([
            'user_id' => $user->id,
            'hero_class' => $heroClass,
            'score' => $score,
            'kills' => $kills,
            'coins_earned' => $coinsEarned,
            'duration_seconds' => $duration,
            'result' => $result,
        ]);

        return response()->json([
            'success' => true,
            'coins' => $user->coins,
            'matches_played' => $user->matches_played,
            'total_kills' => $user->total_kills,
            'high_score' => $user->high_score,
            'message' => "Match saved! +{$coinsEarned} coins added.",
        ]);
    }

    /**
     * Server-to-server webhook endpoint called by Node.js Arena server when a match concludes.
     */
    public function claimReward(Request $request): JsonResponse
    {
        $secret = env('ARENA_SERVER_SECRET', 'crystal-brawlers-super-secret-key');
        $providedSig = $request->header('X-Arena-Signature');

        $userId = (int) $request->input('user_id');
        $score = (int) $request->input('score', 0);
        $kills = (int) $request->input('kills', 0);
        $coinsEarned = (int) $request->input('coins_earned', 0);
        $duration = (int) $request->input('duration_seconds', 0);
        $heroClass = $request->input('hero_class', 'knight');
        $result = $request->input('result', 'completed');

        // Check HMAC signature
        $dataToSign = "{$userId}:{$score}:{$kills}:{$coinsEarned}:{$duration}";
        $expectedSig = hash_hmac('sha256', $dataToSign, $secret);

        if (!hash_equals($expectedSig, (string) $providedSig)) {
            if (!auth()->check() || auth()->id() !== $userId) {
                return response()->json(['error' => 'Invalid arena reward signature or unauthorized'], 403);
            }
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Apply coin rewards
        $user->increment('coins', $coinsEarned);
        $user->increment('matches_played', 1);
        $user->increment('total_kills', $kills);
        if ($score > $user->high_score) {
            $user->high_score = $score;
            $user->save();
        }

        // Record history
        MatchHistory::create([
            'user_id' => $user->id,
            'hero_class' => $heroClass,
            'score' => $score,
            'kills' => $kills,
            'coins_earned' => $coinsEarned,
            'duration_seconds' => $duration,
            'result' => $result,
        ]);

        return response()->json([
            'success' => true,
            'new_coin_balance' => $user->coins,
            'message' => "Successfully awarded {$coinsEarned} coins to {$user->name}!",
        ]);
    }
}
