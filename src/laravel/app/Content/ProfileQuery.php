<?php

namespace App\Content;

use App\Models\Profile;

class ProfileQuery
{
    public function find(): ?Profile
    {
        return Profile::with('translations')->first();
    }
}
