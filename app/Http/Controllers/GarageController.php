<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GarageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user->load('skins', 'matchHistories');

        $heroClasses = HeroesController::getHeroClasses();
        $activeHeroMeta = collect($heroClasses)->firstWhere('id', $user->selected_hero_class) ?? $heroClasses[0];

        // Cost calculations based on current levels
        $hpUpgradeCost = $user->stat_hp_level * 500;
        $damageUpgradeCost = $user->stat_damage_level * 600;
        $speedUpgradeCost = $user->stat_speed_level * 750;

        return Inertia::render('Garage', [
            'heroClasses' => $heroClasses,
            'activeHeroMeta' => $activeHeroMeta,
            'userSkins' => $user->skins,
            'matchHistories' => $user->matchHistories()->take(10)->get(),
            'upgradeCosts' => [
                'hp' => $hpUpgradeCost,
                'damage' => $damageUpgradeCost,
                'speed' => $speedUpgradeCost,
            ],
        ]);
    }

    public function upgradeStat(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'stat' => ['required', 'string', 'in:hp,damage,speed'],
        ]);

        $user = $request->user();
        $stat = $validated['stat'];

        $costMap = [
            'hp' => $user->stat_hp_level * 500,
            'damage' => $user->stat_damage_level * 600,
            'speed' => $user->stat_speed_level * 750,
        ];

        $columnMap = [
            'hp' => 'stat_hp_level',
            'damage' => 'stat_damage_level',
            'speed' => 'stat_speed_level',
        ];

        $cost = $costMap[$stat];
        $column = $columnMap[$stat];

        if ($user->coins < $cost) {
            return back()->with('error', "Insufficient Gold Coins! You need {$cost} coins for this upgrade.");
        }

        if ($user->$column >= 10) {
            return back()->with('error', "Maximum level 10 reached for this attribute!");
        }

        $user->decrement('coins', $cost);
        $user->increment($column, 1);

        return back()->with('success', "Upgraded " . strtoupper($stat) . " to Level " . ($user->$column) . "!");
    }
}
