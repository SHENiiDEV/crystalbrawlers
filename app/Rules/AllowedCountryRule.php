<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedCountryRule implements ValidationRule
{
    /**
     * Prohibited / Sanctioned countries ISO codes.
     */
    public const PROHIBITED_CODES = [
        'RU', // Russia
        'BY', // Belarus
        'KP', // North Korea
        'IR', // Iran
        'SY', // Syria
        'CU', // Cuba
        'SD', // Sudan
        'VE', // Venezuela
    ];

    /**
     * Allowed countries for frontend dropdown & backend verification.
     */
    public static function getAllowedCountries(): array
    {
        $all = [
            ['code' => 'US', 'name' => 'United States', 'dial_code' => '+1', 'flag' => '🇺🇸'],
            ['code' => 'GB', 'name' => 'United Kingdom', 'dial_code' => '+44', 'flag' => '🇬🇧'],
            ['code' => 'CA', 'name' => 'Canada', 'dial_code' => '+1', 'flag' => '🇨🇦'],
            ['code' => 'DE', 'name' => 'Germany', 'dial_code' => '+49', 'flag' => '🇩🇪'],
            ['code' => 'FR', 'name' => 'France', 'dial_code' => '+33', 'flag' => '🇫🇷'],
            ['code' => 'ES', 'name' => 'Spain', 'dial_code' => '+34', 'flag' => '🇪🇸'],
            ['code' => 'IT', 'name' => 'Italy', 'dial_code' => '+39', 'flag' => '🇮🇹'],
            ['code' => 'PL', 'name' => 'Poland', 'dial_code' => '+48', 'flag' => '🇵🇱'],
            ['code' => 'UA', 'name' => 'Ukraine', 'dial_code' => '+380', 'flag' => '🇺🇦'],
            ['code' => 'NL', 'name' => 'Netherlands', 'dial_code' => '+31', 'flag' => '🇳🇱'],
            ['code' => 'SE', 'name' => 'Sweden', 'dial_code' => '+46', 'flag' => '🇸🇪'],
            ['code' => 'NO', 'name' => 'Norway', 'dial_code' => '+47', 'flag' => '🇳🇴'],
            ['code' => 'FI', 'name' => 'Finland', 'dial_code' => '+358', 'flag' => '🇫🇮'],
            ['code' => 'DK', 'name' => 'Denmark', 'dial_code' => '+45', 'flag' => '🇩🇰'],
            ['code' => 'EE', 'name' => 'Estonia', 'dial_code' => '+372', 'flag' => '🇪🇪'],
            ['code' => 'LV', 'name' => 'Latvia', 'dial_code' => '+371', 'flag' => '🇱🇻'],
            ['code' => 'LT', 'name' => 'Lithuania', 'dial_code' => '+370', 'flag' => '🇱🇹'],
            ['code' => 'AU', 'name' => 'Australia', 'dial_code' => '+61', 'flag' => '🇦🇺'],
            ['code' => 'NZ', 'name' => 'New Zealand', 'dial_code' => '+64', 'flag' => '🇳🇿'],
            ['code' => 'JP', 'name' => 'Japan', 'dial_code' => '+81', 'flag' => '🇯🇵'],
            ['code' => 'KR', 'name' => 'South Korea', 'dial_code' => '+82', 'flag' => '🇰🇷'],
            ['code' => 'SG', 'name' => 'Singapore', 'dial_code' => '+65', 'flag' => '🇸🇬'],
            ['code' => 'BR', 'name' => 'Brazil', 'dial_code' => '+55', 'flag' => '🇧🇷'],
            ['code' => 'MX', 'name' => 'Mexico', 'dial_code' => '+52', 'flag' => '🇲🇽'],
            ['code' => 'CH', 'name' => 'Switzerland', 'dial_code' => '+41', 'flag' => '🇨🇭'],
            ['code' => 'AT', 'name' => 'Austria', 'dial_code' => '+43', 'flag' => '🇦🇹'],
            ['code' => 'BE', 'name' => 'Belgium', 'dial_code' => '+32', 'flag' => '🇧🇪'],
            ['code' => 'IE', 'name' => 'Ireland', 'dial_code' => '+353', 'flag' => '🇮🇪'],
            ['code' => 'PT', 'name' => 'Portugal', 'dial_code' => '+351', 'flag' => '🇵🇹'],
            ['code' => 'CZ', 'name' => 'Czech Republic', 'dial_code' => '+420', 'flag' => '🇨🇿'],
            ['code' => 'RO', 'name' => 'Romania', 'dial_code' => '+40', 'flag' => '🇷🇴'],
        ];

        return array_filter($all, fn ($item) => !in_array(strtoupper($item['code']), self::PROHIBITED_CODES, true));
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $code = strtoupper((string) $value);

        if (in_array($code, self::PROHIBITED_CODES, true)) {
            $fail("Registration from this country is restricted in accordance with international sanctions and regulatory compliance policies.");
            return;
        }

        $allowedCodes = array_column(self::getAllowedCountries(), 'code');
        if (!in_array($code, $allowedCodes, true)) {
            $fail("The selected country is not supported for account registration.");
        }
    }
}
