<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_id',
        'item_type',
        'item_name',
        'price_coins',
        'price_crystals',
        'amount_usd',
        'currency',
        'payment_method',
        'status',
        'billing_name',
        'billing_email',
        'billing_address',
        'billing_city',
        'billing_country',
        'billing_post_code',
    ];

    protected function casts(): array
    {
        return [
            'price_coins' => 'integer',
            'price_crystals' => 'integer',
            'amount_usd' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateNumber(): string
    {
        return 'INV-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));
    }
}
