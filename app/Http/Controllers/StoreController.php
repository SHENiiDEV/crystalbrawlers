<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $ownedSkinIds = $user ? $user->skins()->pluck('skins.id')->toArray() : [];

        $skins = Skin::all()->map(function ($skin) use ($ownedSkinIds) {
            $skin->is_owned = in_array($skin->id, $ownedSkinIds, true);
            return $skin;
        });

        return Inertia::render('Store', [
            'skins' => $skins,
            'equippedSkin' => $user->equipped_skin ?? 'default-knight',
        ]);
    }

    public function buySkin(Request $request, Skin $skin): RedirectResponse
    {
        $user = $request->user();

        if ($user->ownsSkin($skin->id)) {
            return back()->with('message', 'You already own this skin!');
        }

        // Check currency (coins or crystals)
        if ($skin->price_coins > 0 && $user->coins < $skin->price_coins) {
            return back()->with('error', "Not enough Gold Coins! Required: {$skin->price_coins}");
        }

        if ($skin->price_crystals > 0 && $user->crystals < $skin->price_crystals) {
            return back()->with('error', "Not enough Crystals! Required: {$skin->price_crystals}");
        }

        if ($skin->price_coins > 0) {
            $user->decrement('coins', $skin->price_coins);
        }
        if ($skin->price_crystals > 0) {
            $user->decrement('crystals', $skin->price_crystals);
        }

        $user->skins()->attach($skin->id);

        // Generate Invoice Record
        $invoice = \App\Models\Invoice::create([
            'invoice_number' => \App\Models\Invoice::generateNumber(),
            'user_id' => $user->id,
            'item_type' => 'skin',
            'item_name' => $skin->name . " ({$skin->hero_class} skin)",
            'price_coins' => $skin->price_coins,
            'price_crystals' => $skin->price_crystals,
            'amount_usd' => 0.00,
            'currency' => $skin->price_coins > 0 ? 'GOLD' : 'CRYSTALS',
            'payment_method' => $skin->price_coins > 0 ? 'In-Game Gold' : 'In-Game Crystals',
            'status' => 'paid',
            'billing_name' => $user->name . ' ' . $user->surname,
            'billing_email' => $user->email,
            'billing_address' => $user->street_address ?? 'Digital Delivery',
            'billing_city' => $user->city ?? '',
            'billing_country' => $user->country ?? 'Global',
            'billing_post_code' => $user->post_code ?? '',
        ]);

        // Send Invoice Email Receipt
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\OrderInvoiceMail($invoice));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send order invoice email: " . $e->getMessage());
        }

        return back()->with('success', "Congratulations! You unlocked {$skin->name}. Invoice #{$invoice->invoice_number} generated.");
    }

    public function equipSkin(Request $request, Skin $skin): RedirectResponse
    {
        $user = $request->user();

        if (!$user->ownsSkin($skin->id)) {
            return back()->with('error', 'You must unlock this skin first!');
        }

        $user->equipped_skin = $skin->slug;
        $user->save();

        return back()->with('success', "Equipped {$skin->name}!");
    }
}
