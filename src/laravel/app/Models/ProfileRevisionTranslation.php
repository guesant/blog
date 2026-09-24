<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfileRevisionTranslation extends RevisionTranslation
{
    protected $table = 'profile_revision_translations';

    public function getPersonalInterestsAttribute(): array
    {
        return $this->values('profile_revision_interests');
    }

    public function getTrajectoryAttribute(): array
    {
        return collect($this->rows('profile_revision_trajectory'))->map(function (array $item): array {
            $item['highlights'] = DB::table('profile_revision_trajectory_highlights')
                ->where('trajectory_id', $item['id'] ?? 0)
                ->orderBy('sort_order')
                ->pluck('value')
                ->all();

            return $item;
        })->all();
    }

    public function getMilestonesAttribute(): array
    {
        return $this->rows('profile_revision_milestones');
    }

    public function getPersonalFactsAttribute(): array
    {
        return $this->values('profile_revision_facts');
    }

    public function getPersonalThingsAttribute(): array
    {
        return $this->rows('profile_revision_things');
    }

    private function rows(string $table): array
    {
        return DB::table($table)
            ->where('profile_revision_translation_id', $this->id)
            ->orderBy('sort_order')
            ->get()
            ->map(function (object $row): array {
                return collect((array) $row)
                    ->except(['profile_revision_translation_id', 'sort_order', 'created_at', 'updated_at'])
                    ->mapWithKeys(fn (mixed $value, string $key): array => [Str::camel($key) => $value])
                    ->all();
            })
            ->all();
    }

    private function values(string $table): array
    {
        return DB::table($table)
            ->where('profile_revision_translation_id', $this->id)
            ->orderBy('sort_order')
            ->pluck('value')
            ->all();
    }
}
