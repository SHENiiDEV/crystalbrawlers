<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Skin;
use App\Models\User;
use App\Rules\AgeEighteenPlusRule;
use App\Rules\AllowedCountryRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'allowedCountries' => array_values(AllowedCountryRule::getAllowedCountries()),
        ]);
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Step 1: Personal & Account
            'name' => ['required', 'string', 'max:50'],
            'surname' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
            'date_of_birth' => ['required', 'date', new AgeEighteenPlusRule],
            'phone' => ['required', 'string', 'max:30'],

            // Step 2: Address & Location (Sanctions Filtered)
            'street_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'size:2', new AllowedCountryRule],
            'post_code' => ['required', 'string', 'max:20'],

            // Step 3: Legal Agreements
            'terms_accepted' => ['required', 'accepted'],
        ], [
            'terms_accepted.accepted' => 'You must agree to the Terms & Conditions and Privacy Policy to create an account.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'date_of_birth' => $validated['date_of_birth'],
            'phone' => $validated['phone'],
            'street_address' => $validated['street_address'],
            'city' => $validated['city'],
            'country' => strtoupper($validated['country']),
            'post_code' => $validated['post_code'],
            'terms_accepted_at' => now(),
            'coins' => 25000,
            'crystals' => 1500,
            'selected_hero_class' => 'knight',
            'equipped_skin' => 'default-knight',
            'stat_hp_level' => 1,
            'stat_damage_level' => 1,
            'stat_speed_level' => 1,
        ]);

        // Every free (common) skin is unlocked from the start
        $starterSkinIds = Skin::where('price_coins', 0)->where('price_crystals', 0)->pluck('id')->all();
        if ($starterSkinIds) {
            $user->skins()->syncWithoutDetaching($starterSkinIds);
        }

        Auth::login($user);

        // Send Welcome Email via Namecheap PrivateEmail
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeUserMail($user));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send welcome email: " . $e->getMessage());
        }

        return redirect()->route('heroes')->with('success', 'Welcome to Crystal Brawlers! Choose your hero class and prepare for battle.');
    }
}
