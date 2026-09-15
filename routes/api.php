<?php

use App\Http\Controllers\ArenaController;
use Illuminate\Support\Facades\Route;

Route::post('/arena/reward', [ArenaController::class, 'claimReward'])->name('api.arena.reward');
