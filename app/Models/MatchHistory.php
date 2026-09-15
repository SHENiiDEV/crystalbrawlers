<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hero_class',
        'score',
        'kills',
        'coins_earned',
        'duration_seconds',
        'result',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'kills' => 'integer',
            'coins_earned' => 'integer',
            'duration_seconds' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
