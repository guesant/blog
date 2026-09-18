<?php

namespace App\Support;

use Illuminate\Support\Carbon;

class HumanDate
{
    public static function format(?Carbon $date, string $locale): ?string
    {
        return $date?->locale($locale)->isoFormat('DD MMM YYYY');
    }
}
