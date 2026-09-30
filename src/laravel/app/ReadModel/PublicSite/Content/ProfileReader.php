<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\Profile;

class ProfileReader
{
    public function find(): ?Profile
    {
        return Profile::query()
            ->published()
            ->with('publishedTranslations')
            ->first();
    }
}
