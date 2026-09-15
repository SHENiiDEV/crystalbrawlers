<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopUpController extends Controller
{
    /**
     * Currency packages. Payment is not wired to a provider yet — buying a
     * package credits the wallet immediately and is flagged as a demo purchase.
     */
    public static function packages(): array
    {
        return [
            // --- Gold coins ---
            ['id' => 'coins_small', 'currency' => 'coins', 'amount' => 5000, 'bonus' => 0, 'price' => 1.99, 'tag' => null],
            ['id' => 'coins_medium', 'currency' => 'coins', 'amount' => 15000, 'bonus' => 1500, 'price' => 4.99, 'tag' => '+10% bonus'],
            ['id' => 'coins_large', 'currency' => 'coins', 'amount' => 40000, 'bonus' => 8000, 'price' => 9.99, 'tag' => 'Most popular'],
            ['id' => 'coins_huge', 'currency' => 'coins', 'amount' => 100000, 'bonus' => 30000, 'price' => 19.99, 'tag' => 'Best value'],

            // --- Crystals ---
            ['id' => 'crystals_small', 'currency' => 'crystals', 'amount' => 250, 'bonus' => 0, 'price' => 2.99, 'tag' => null],
            ['id' => 'crystals_medium', 'currency' => 'crystals', 'amount' => 700, 'bonus' => 70, 'price' => 6.99, 'tag' => '+10% bonus'],
            ['id' => 'crystals_large', 'currency' => 'crystals', 'amount' => 1800, 'bonus' => 320, 'price' => 14.99, 'tag' => 'Most popular'],
            ['id' => 'crystals_huge', 'currency' => 'crystals', 'amount' => 4000, 'bonus' => 1200, 'price' => 29.99, 'tag' => 'Best value'],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('TopUp', [
            'packages' => self::packages(),
        ]);
    }

    public function purchase(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'package' => ['required', 'string'],
        ]);

        $package = collect(self::packages())->firstWhere('id', $validated['package']);

        if (! $package) {
            return back()->with('error', 'Unknown package.');
        }

        $user = $request->user();
        $total = $package['amount'] + $package['bonus'];

        $user->increment($package['currency'] === 'coins' ? 'coins' : 'crystals', $total);

        $label = $package['currency'] === 'coins' ? 'Gold Coins' : 'Crystals';

        return back()->with('success', "Purchase complete — {$total} {$label} added to your wallet!");
    }
}
