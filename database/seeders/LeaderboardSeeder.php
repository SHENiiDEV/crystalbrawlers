<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LeaderboardSeeder extends Seeder
{
    /**
     * Add non-login demonstration players without changing existing accounts.
     */
    public function run(): void
    {
        $players = [
            ['name' => 'VortexBlade (bot)', 'kills' => 312, 'high_score' => 9840, 'hero' => 'rogue'],
            ['name' => 'ShadowHex (bot)', 'kills' => 280, 'high_score' => 8750, 'hero' => 'mage'],
            ['name' => 'IronAegis (bot)', 'kills' => 245, 'high_score' => 7900, 'hero' => 'knight'],
            ['name' => 'NeonDeadeye (bot)', 'kills' => 210, 'high_score' => 6950, 'hero' => 'hunter'],
            ['name' => 'BloodFury (bot)', 'kills' => 195, 'high_score' => 6400, 'hero' => 'berserker'],
        ];

        foreach ($players as $index => $player) {
            User::firstOrCreate(
                ['email' => 'leaderboard-bot-'.($index + 1).'@example.invalid'],
                [
                    'name' => $player['name'],
                    'surname' => 'Gladiator',
                    'password' => Hash::make(Str::random(64)),
                    'selected_hero_class' => $player['hero'],
                    'total_kills' => $player['kills'],
                    'high_score' => $player['high_score'],
                    'matches_played' => 30 + ($index * 5),
                    'country' => 'US',
                ]
            );
        }
    }
}
