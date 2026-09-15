<?php

use App\Http\Controllers\ArenaController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\GarageController;
use App\Http\Controllers\HeroesController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TopUpController;
use Illuminate\Support\Facades\Route;

// Public Informational & Legal Pages
Route::get('/', [PageController::class, 'welcome'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/how-it-works', [PageController::class, 'howItWorks'])->name('how-it-works');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/leaderboard', [PageController::class, 'leaderboard'])->name('leaderboard');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/refund-policy', [PageController::class, 'refundPolicy'])->name('refund-policy');
Route::get('/aml-policy', [PageController::class, 'amlPolicy'])->name('aml-policy');
Route::get('/cookie-policy', [PageController::class, 'cookiePolicy'])->name('cookie-policy');
Route::get('/payment-security', [PageController::class, 'paymentSecurity'])->name('payment-security');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');

// Articles & Patch Notes
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Authenticated Game Hub Routes
Route::middleware('auth')->group(function () {
    // Hall of Heroes
    Route::get('/heroes', [HeroesController::class, 'index'])->name('heroes');
    Route::post('/heroes/select', [HeroesController::class, 'selectHero'])->name('heroes.select');

    // The Garage / Dashboard
    Route::get('/garage', [GarageController::class, 'index'])->name('garage');
    Route::post('/garage/upgrade', [GarageController::class, 'upgradeStat'])->name('garage.upgrade');

    // The Skin Store
    Route::get('/store', [StoreController::class, 'index'])->name('store');
    Route::post('/store/buy/{skin}', [StoreController::class, 'buySkin'])->name('store.buy');
    Route::post('/store/equip/{skin}', [StoreController::class, 'equipSkin'])->name('store.equip');

    // Wallet Top-Up
    Route::get('/topup', [TopUpController::class, 'index'])->name('topup');
    Route::post('/topup', [TopUpController::class, 'purchase'])->name('topup.purchase');

    // Invoices & Purchase Receipts
    Route::get('/invoices', [\App\Http\Controllers\InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [\App\Http\Controllers\InvoiceController::class, 'show'])->name('invoices.show');

    // Real-time Arena Game Screen
    Route::get('/arena', [ArenaController::class, 'index'])->name('arena');
    Route::post('/arena/finish', [ArenaController::class, 'finishMatch'])->name('arena.finish');
});
