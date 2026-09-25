<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\Profile;

class ProfileReader
{
    public function find(): ?Profile
    {
        return Profile::query()
            ->whereHas('currentRevision', static function ($query): void {
                $query->where(fn ($visibility) => $visibility
                    ->where('hidden', false)
                    ->orWhereNull('hidden'));
            })
            ->with([
                'currentRevision' => static function ($query): void {
                    $query
                        ->where(fn ($visibility) => $visibility
                            ->where('hidden', false)
                            ->orWhereNull('hidden'))
                        ->with('translations');
                },
            ])
            ->first();
    }
}
