<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('item_type')->default('skin'); // skin, stat_upgrade, crystals, package
            $table->string('item_name');
            $table->unsignedBigInteger('price_coins')->default(0);
            $table->unsignedBigInteger('price_crystals')->default(0);
            $table->decimal('amount_usd', 8, 2)->default(0.00);
            $table->string('currency')->default('GOLD');
            $table->string('payment_method')->default('In-Game Wallet');
            $table->string('status')->default('paid'); // paid, refunded, pending
            $table->string('billing_name');
            $table->string('billing_email');
            $table->string('billing_address')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_country')->nullable();
            $table->string('billing_post_code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
