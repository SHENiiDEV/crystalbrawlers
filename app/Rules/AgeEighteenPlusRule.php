<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AgeEighteenPlusRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            $fail("Date of birth is required.");
            return;
        }

        try {
            $dob = Carbon::parse($value);
        } catch (\Exception $e) {
            $fail("Please enter a valid date of birth.");
            return;
        }

        if ($dob->isFuture()) {
            $fail("Date of birth cannot be in the future.");
            return;
        }

        $age = $dob->age;
        if ($age < 18) {
            $fail("You must be at least 18 years of age to register an account.");
        }
    }
}
