<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skin extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'hero_class',
        'rarity',
        'description',
        'price_coins',
        'price_crystals',
        'accent_color',
        'palette',
        'weapon_type',
        'bonus_stats',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'price_coins' => 'integer',
            'price_crystals' => 'integer',
            'bonus_stats' => 'array',
            'palette' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_skins');
    }
}
