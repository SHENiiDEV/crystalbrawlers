<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LeaderboardSeeder extends Seeder
{
    /**
     * Add sample leaderboard profiles without changing real player accounts.
     */
    public function run(): void
    {
        $players = [
            ['name' => 'VortexBlade', 'kills' => 312, 'high_score' => 9840, 'hero' => 'rogue'],
            ['name' => 'ShadowHex', 'kills' => 280, 'high_score' => 8750, 'hero' => 'mage'],
            ['name' => 'IronAegis', 'kills' => 245, 'high_score' => 7900, 'hero' => 'knight'],
            ['name' => 'NeonDeadeye', 'kills' => 210, 'high_score' => 6950, 'hero' => 'hunter'],
            ['name' => 'BloodFury', 'kills' => 195, 'high_score' => 6400, 'hero' => 'berserker'],
        ];

        // Generated with Faker during development; production installs exclude require-dev packages.
        $generatedNames = [
            'libbie.pagac', 'ressie91', 'leola39', 'areinger', 'nicolas.pauline',
            'pauline15', 'zgoodwin', 'dashawn48', 'schuster.sabina', 'gail.adams',
            'zane.swift', 'lora.parisian', 'aubree.harris', 'rachelle92', 'xolson',
            'hauck.adan', 'pframi', 'rylan67', 'isobel.shields', 'gregg.corwin',
            'erika56', 'morgan.mcclure', 'dlemke', 'huel.joy', 'alessia.sauer',
        ];
        $heroClasses = ['knight', 'rogue', 'mage', 'hunter', 'berserker', 'cleric'];

        foreach ($generatedNames as $index => $name) {
            $players[] = [
                'name' => $name,
                'kills' => 185 - ($index * 6),
                'high_score' => 5900 - ($index * 185),
                'hero' => $heroClasses[$index % count($heroClasses)],
            ];
        }

        foreach ($players as $index => $player) {
            $email = 'leaderboard-bot-'.($index + 1).'@example.invalid';

            User::where('email', $email)
                ->where('name', $player['name'].' (bot)')
                ->update(['name' => $player['name']]);

            User::firstOrCreate(
                ['email' => $email],
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
