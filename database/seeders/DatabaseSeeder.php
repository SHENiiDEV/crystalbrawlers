<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\MatchHistory;
use App\Models\Skin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Skins — 24 cosmetics across the six hero classes
        $this->call(SkinSeeder::class);

        // 2. Create Default Test User
        $user = User::updateOrCreate(
            ['email' => 'player@crystalbrawlers.com'],
            [
                'name' => 'Arthur',
                'surname' => 'Pendelton',
                'password' => Hash::make('Password123!'),
                'date_of_birth' => '1998-05-15',
                'phone' => '+1 (555) 234-5678',
                'street_address' => '742 Evergreen Terrace',
                'city' => 'Austin',
                'country' => 'US',
                'post_code' => '78701',
                'terms_accepted_at' => now(),
                'coins' => 25000,
                'crystals' => 1500,
                'selected_hero_class' => 'knight',
                'equipped_skin' => 'default-knight',
                'stat_hp_level' => 3,
                'stat_damage_level' => 2,
                'stat_speed_level' => 2,
                'matches_played' => 14,
                'total_kills' => 58,
                'high_score' => 2480,
            ]
        );

        // Grant every free skin plus a couple of premium ones to the demo account
        $granted = Skin::where(function ($q) {
            $q->where('price_coins', 0)->where('price_crystals', 0);
        })->orWhereIn('slug', ['crimson-paladin', 'void-mage'])->pluck('id')->all();
        $user->skins()->syncWithoutDetaching($granted);

        // 3. Create Seed Articles & Patch Notes
        $articles = [
            [
                'title' => 'Patch 1.4.0: The Hall of Heroes Awakens',
                'slug' => 'patch-1-4-0-hall-of-heroes-awakens',
                'category' => 'Patch Notes',
                'version_tag' => 'v1.4.0',
                'badge_color' => 'emerald',
                'summary' => 'Introducing the Hall of Heroes, 6 specialized combat classes, rebalanced melee hitboxes, and enhanced 30 TPS netcode.',
                'content' => "## What's New in Version 1.4.0\n\n- **6 Distinct Combat Classes**: Choose between Knight, Rogue, Mage, Hunter, Berserker, and Cleric with dedicated stat profiles and weapon affinities.\n- **Optimized 30 TPS WebSocket Engine**: Drastically reduced input delay and silky smooth position interpolation.\n- **Garage Upgrade Station**: Level up your Max HP, Attack Damage, and Movement Speed using coins gathered from arena victories.\n- **Sanctions & Compliance Layer**: Enhanced identity and billing security for global payments.",
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Season 1 Arena Championship Announcement',
                'slug' => 'season-1-arena-championship-announcement',
                'category' => 'Announcements',
                'version_tag' => 'Tournament',
                'badge_color' => 'amber',
                'summary' => 'Compete for over 500,000 Gold Coins and exclusive Legendary Title badges in our premier Season 1 Tournament.',
                'content' => "## The Grand Brawler Championship Begins!\n\nAssemble your builds and hone your reflex timings. Starting this weekend, all arena kills grant double bonus score towards the global seasonal Leaderboard. Top 100 gladiators will receive the exclusive **Archon Champion** border and custom cosmetic loadout.",
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Developer Insights: High-Performance Top-Down Netcode',
                'slug' => 'developer-insights-high-performance-netcode',
                'category' => 'Engineering',
                'version_tag' => 'Tech Blog',
                'badge_color' => 'cyan',
                'summary' => 'Deep dive into our Node.js authoritative physics loop, client-side dead reckoning, and secure server-to-server reward verification.',
                'content' => "## Under the Hood: Building a Sub-50ms Browser Brawler\n\nLearn how Crystal Brawlers delivers responsive top-down combat in the browser using HTML5 Canvas, delta-time server ticks, and a strict separation of concerns between our Laravel financial ledger and Node.js game arena.",
                'published_at' => now()->subDays(10),
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(['slug' => $art['slug']], $art);
        }

        // 4. Create Simulated Match History for realism
        MatchHistory::create([
            'user_id' => $user->id,
            'hero_class' => 'knight',
            'score' => 2480,
            'kills' => 12,
            'coins_earned' => 240,
            'duration_seconds' => 180,
            'result' => 'victory',
        ]);
        MatchHistory::create([
            'user_id' => $user->id,
            'hero_class' => 'berserker',
            'score' => 1850,
            'kills' => 9,
            'coins_earned' => 180,
            'duration_seconds' => 140,
            'result' => 'defeat',
        ]);

        // 5. Create Simulated Leaderboard Bots/Players
        $gladiators = [
            ['name' => 'VortexBlade', 'kills' => 312, 'high_score' => 9840, 'hero' => 'rogue'],
            ['name' => 'ShadowHex', 'kills' => 280, 'high_score' => 8750, 'hero' => 'mage'],
            ['name' => 'IronAegis', 'kills' => 245, 'high_score' => 7900, 'hero' => 'knight'],
            ['name' => 'NeonDeadeye', 'kills' => 210, 'high_score' => 6950, 'hero' => 'hunter'],
            ['name' => 'BloodFury', 'kills' => 195, 'high_score' => 6400, 'hero' => 'berserker'],
        ];

        foreach ($gladiators as $idx => $g) {
            $botUser = User::updateOrCreate(
                ['email' => strtolower($g['name']) . '@brawlers.gg'],
                [
                    'name' => $g['name'],
                    'surname' => 'Gladiator',
                    'password' => Hash::make('Secret123!'),
                    'selected_hero_class' => $g['hero'],
                    'total_kills' => $g['kills'],
                    'high_score' => $g['high_score'],
                    'matches_played' => 30 + $idx * 5,
                    'country' => 'US',
                ]
            );
        }
    }
}
