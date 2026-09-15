<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Skin;
use App\Models\User;
use App\Rules\AllowedCountryRule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function welcome(): Response
    {
        $featuredSkins = Skin::where('is_featured', true)->get();
        $latestArticles = Article::latest('published_at')->take(3)->get();
        $topGladiators = User::orderByDesc('high_score')->take(5)->get(['id', 'name', 'selected_hero_class', 'high_score', 'total_kills']);

        return Inertia::render('Welcome', [
            'featuredSkins' => $featuredSkins,
            'latestArticles' => $latestArticles,
            'topGladiators' => $topGladiators,
            'allowedCountries' => array_values(AllowedCountryRule::getAllowedCountries()),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function howItWorks(): Response
    {
        return Inertia::render('HowItWorks');
    }

    public function faq(): Response
    {
        return Inertia::render('Faq');
    }

    public function leaderboard(): Response
    {
        $leaderboard = User::orderByDesc('high_score')
            ->take(50)
            ->get(['id', 'name', 'selected_hero_class', 'high_score', 'total_kills', 'matches_played', 'country']);

        return Inertia::render('Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('Legal/Terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy');
    }

    public function refundPolicy(): Response
    {
        return Inertia::render('Legal/RefundPolicy');
    }

    public function amlPolicy(): Response
    {
        return Inertia::render('Legal/AmlPolicy');
    }

    public function cookiePolicy(): Response
    {
        return Inertia::render('Legal/CookiePolicy');
    }

    public function paymentSecurity(): Response
    {
        return Inertia::render('Legal/PaymentSecurity');
    }

    public function contact(): Response
    {
        return Inertia::render('Contact');
    }
}
