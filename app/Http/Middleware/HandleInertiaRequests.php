<?php

namespace App\Http\Middleware;

use App\Models\Skin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'surname' => $request->user()->surname,
                    'email' => $request->user()->email,
                    'coins' => (int) ($request->user()->coins ?? 0),
                    'crystals' => (int) ($request->user()->crystals ?? 0),
                    'selected_hero_class' => $request->user()->selected_hero_class ?? 'knight',
                    'equipped_skin' => $request->user()->equipped_skin ?? 'default',
                    'stat_hp_level' => (int) ($request->user()->stat_hp_level ?? 1),
                    'stat_damage_level' => (int) ($request->user()->stat_damage_level ?? 1),
                    'stat_speed_level' => (int) ($request->user()->stat_speed_level ?? 1),
                    'matches_played' => (int) ($request->user()->matches_played ?? 0),
                    'total_kills' => (int) ($request->user()->total_kills ?? 0),
                    'high_score' => (int) ($request->user()->high_score ?? 0),
                ] : null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            // Skin palettes feed the canvas renderer (slug => palette map)
            'skinPalettes' => fn () => Cache::remember(
                'skin_palettes',
                600,
                fn () => Skin::all()->mapWithKeys(fn (Skin $skin) => [$skin->slug => $skin->palette])->filter()->all()
            ),
            'game_config' => [
                'ws_server_url' => env('ARENA_WS_URL', 'http://localhost:3001'),
            ],
        ];
    }
}
