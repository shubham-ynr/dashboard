<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    protected array $forbidden;

    public function __construct(array $forbidden = [])
    {
        $this->forbidden = $forbidden;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strlen($value) < 8) {
            $fail("Password must be at least 8 characters.");
        }

        if (!preg_match('/[A-Z]/', $value)) {
            $fail("Password must contain at least one uppercase letter.");
        }

        if (!preg_match('/[a-z]/', $value)) {
            $fail("Password must contain at least one lowercase letter.");
        }

        if (!preg_match('/[0-9]/', $value)) {
            $fail("Password must contain at least one number.");
        }

        if (!preg_match('/[!@#$%^&*]/', $value)) {
            $fail("Password must contain at least one special character (!@#$%^&*).");
        }

        foreach ($this->forbidden as $forbiddenString) {
            if ($forbiddenString && str_contains(strtolower($value), strtolower($forbiddenString))) {
                $fail("Password should not contain any part of your personal information. ({$forbiddenString})");
            }
        }
    }
}
