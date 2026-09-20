<?php

namespace App\Models\Concerns;

use App\Content\Locale;

trait HasTranslations
{
    public function translation(?string $locale = null)
    {
        $locale = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'en');
    }
}
