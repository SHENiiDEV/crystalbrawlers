<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroesController extends Controller
{
    /**
     * Hero class definitions matching the visual reference.
     */
    public static function getHeroClasses(): array
    {
        return [
            [
                'id' => 'knight',
                'name' => 'Knight',
                'title' => 'Guardian of the Citadel',
                'description' => 'Heavy Armor. Powerful Strike. Taunts Enemies.',
                'theme_color' => '#06b6d4',
                'badge' => '🛡️ Tank',
                'stats' => [
                    'hp' => 220,
                    'damage' => 120,
                    'speed' => 65,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Melee Broadsword Slash',
                'attack_range' => 90,
                'attack_cooldown' => 450, // ms
            ],
            [
                'id' => 'rogue',
                'name' => 'Rogue',
                'title' => 'Shadow of the Eclipse',
                'description' => 'Stealth. Rapid Attacks. Dual Daggers.',
                'theme_color' => '#d946ef',
                'badge' => '🗡️ Assassin',
                'stats' => [
                    'hp' => 120,
                    'damage' => 190,
                    'speed' => 120,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Dual Dagger Flurry',
                'attack_range' => 70,
                'attack_cooldown' => 260,
            ],
            [
                'id' => 'mage',
                'name' => 'Mage',
                'title' => 'Archon of Arcane Fire',
                'description' => 'Ranged Spells. Area Damage. Mystic Staff.',
                'theme_color' => '#10b981',
                'badge' => '🔮 Spellcaster',
                'stats' => [
                    'hp' => 90,
                    'damage' => 230,
                    'speed' => 80,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Arcane Energy Orbs',
                'attack_range' => 380,
                'attack_cooldown' => 500,
            ],
            [
                'id' => 'hunter',
                'name' => 'Hunter',
                'title' => 'Sylvan Deadeye',
                'description' => 'Precision Archery. Neon Arrows. Long Bow.',
                'theme_color' => '#f59e0b',
                'badge' => '🏹 Marksman',
                'stats' => [
                    'hp' => 130,
                    'damage' => 170,
                    'speed' => 105,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Piercing Neon Arrows',
                'attack_range' => 450,
                'attack_cooldown' => 420,
            ],
            [
                'id' => 'berserker',
                'name' => 'Berserker',
                'title' => 'Molten Juggernaut',
                'description' => 'High Damage. Red Flame. Two-Handed Axe.',
                'theme_color' => '#ef4444',
                'badge' => '🪓 Brawler',
                'stats' => [
                    'hp' => 180,
                    'damage' => 240,
                    'speed' => 75,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Molten Great-Axe Cleave',
                'attack_range' => 100,
                'attack_cooldown' => 550,
            ],
            [
                'id' => 'cleric',
                'name' => 'Cleric',
                'title' => 'Herald of Dawn',
                'description' => 'Healing. Team Support. Staff with Holy Light.',
                'theme_color' => '#38bdf8',
                'badge' => '✝️ Support / Healer',
                'stats' => [
                    'hp' => 160,
                    'damage' => 110,
                    'speed' => 90,
                ],
                'max_stats' => [
                    'hp' => 250,
                    'damage' => 250,
                    'speed' => 130,
                ],
                'attack_type' => 'Radiant Holy Burst',
                'attack_range' => 260,
                'attack_cooldown' => 400,
            ],
        ];
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $heroClasses = self::getHeroClasses();

        return Inertia::render('Heroes', [
            'heroClasses' => $heroClasses,
            'selectedClass' => $user->selected_hero_class ?? 'knight',
        ]);
    }

    public function selectHero(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_class' => ['required', 'string', 'in:knight,rogue,mage,hunter,berserker,cleric'],
        ]);

        $user = $request->user();
        $user->selected_hero_class = $validated['hero_class'];
        $user->save();

        return back()->with('success', "Active hero switched to " . ucfirst($validated['hero_class']) . "!");
    }
}
