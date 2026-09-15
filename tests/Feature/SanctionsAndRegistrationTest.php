<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SanctionsAndRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_landing_page_renders_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_registration_rejects_sanctioned_country(): void
    {
        $response = $this->post('/register', [
            'name' => 'Ivan',
            'surname' => 'Petrov',
            'email' => 'ivan@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'date_of_birth' => '1995-04-12',
            'phone' => '+7 999 1234567',
            'street_address' => 'Red Square 1',
            'city' => 'Moscow',
            'country' => 'RU', // Sanctioned
            'post_code' => '101000',
            'terms_accepted' => true,
        ]);

        $response->assertSessionHasErrors('country');
        $this->assertDatabaseMissing('users', ['email' => 'ivan@example.com']);
    }

    public function test_registration_rejects_under_18_years_old(): void
    {
        $response = $this->post('/register', [
            'name' => 'Young',
            'surname' => 'Gladiator',
            'email' => 'young@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'date_of_birth' => now()->subYears(16)->format('Y-m-d'), // 16 years old
            'phone' => '+1 (555) 321-4321',
            'street_address' => '123 Pine St',
            'city' => 'Seattle',
            'country' => 'US',
            'post_code' => '98101',
            'terms_accepted' => true,
        ]);

        $response->assertSessionHasErrors('date_of_birth');
        $this->assertDatabaseMissing('users', ['email' => 'young@example.com']);
    }

    public function test_registration_succeeds_with_valid_compliant_data(): void
    {
        $response = $this->post('/register', [
            'name' => 'Lancelot',
            'surname' => 'DuLac',
            'email' => 'lancelot@example.com',
            'password' => 'HolyGrail2026!',
            'password_confirmation' => 'HolyGrail2026!',
            'date_of_birth' => '1996-08-20',
            'phone' => '+1 (555) 444-5555',
            'street_address' => '450 Camelot Way',
            'city' => 'London',
            'country' => 'GB',
            'post_code' => 'SW1A 1AA',
            'terms_accepted' => true,
        ]);

        $response->assertRedirect('/heroes');
        $this->assertAuthenticated();

        $user = User::where('email', 'lancelot@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals(25000, $user->coins);
        $this->assertEquals(1500, $user->crystals);
        $this->assertEquals('knight', $user->selected_hero_class);
    }
}
