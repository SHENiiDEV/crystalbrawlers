<?php

namespace Tests\Feature;

use App\Models\Skin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GarageAndStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_user_can_upgrade_stat_in_garage(): void
    {
        $user = User::where('email', 'player@crystalbrawlers.com')->first();
        $initialCoins = $user->coins;
        $initialHpLvl = $user->stat_hp_level;
        $cost = $initialHpLvl * 500;

        $response = $this->actingAs($user)->post('/garage/upgrade', [
            'stat' => 'hp',
        ]);

        $response->assertSessionHasNoErrors();
        $user->refresh();

        $this->assertEquals($initialHpLvl + 1, $user->stat_hp_level);
        $this->assertEquals($initialCoins - $cost, $user->coins);
    }

    public function test_user_can_select_hero_class(): void
    {
        $user = User::where('email', 'player@crystalbrawlers.com')->first();

        $response = $this->actingAs($user)->post('/heroes/select', [
            'hero_class' => 'berserker',
        ]);

        $response->assertSessionHasNoErrors();
        $user->refresh();

        $this->assertEquals('berserker', $user->selected_hero_class);
    }

    public function test_user_can_purchase_and_equip_skin_in_store(): void
    {
        $user = User::where('email', 'player@crystalbrawlers.com')->first();
        $skin = Skin::where('slug', 'shadow-assassin')->first();
        $initialCoins = $user->coins;

        // Buy Skin
        $buyResponse = $this->actingAs($user)->post("/store/buy/{$skin->id}");
        $buyResponse->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertTrue($user->ownsSkin($skin->id));
        $this->assertEquals($initialCoins - $skin->price_coins, $user->coins);

        // Equip Skin
        $equipResponse = $this->actingAs($user)->post("/store/equip/{$skin->id}");
        $equipResponse->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertEquals($skin->slug, $user->equipped_skin);
    }
}
