<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'date_of_birth',
        'phone',
        'street_address',
        'city',
        'country',
        'post_code',
        'terms_accepted_at',
        'coins',
        'crystals',
        'selected_hero_class',
        'equipped_skin',
        'stat_hp_level',
        'stat_damage_level',
        'stat_speed_level',
        'matches_played',
        'total_kills',
        'high_score',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'coins' => 'integer',
            'crystals' => 'integer',
            'stat_hp_level' => 'integer',
            'stat_damage_level' => 'integer',
            'stat_speed_level' => 'integer',
            'matches_played' => 'integer',
            'total_kills' => 'integer',
            'high_score' => 'integer',
        ];
    }

    public function skins(): BelongsToMany
    {
        return $this->belongsToMany(Skin::class, 'user_skins')->withPivot('acquired_at');
    }

    public function matchHistories(): HasMany
    {
        return $this->hasMany(MatchHistory::class)->latest();
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class)->latest();
    }

    public function ownsSkin(int|string $skinIdentifier): bool
    {
        if (is_numeric($skinIdentifier)) {
            return $this->skins()->where('skins.id', $skinIdentifier)->exists();
        }
        return $this->skins()->where('skins.slug', $skinIdentifier)->exists();
    }
}
