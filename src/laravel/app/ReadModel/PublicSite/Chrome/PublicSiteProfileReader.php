<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class PublicSiteProfileReader
{
    public function read(string $locale): PublicSiteProfileReadResult
    {
        $profile = DB::table('profiles')
            ->leftJoin('profile_revisions', 'profile_revisions.id', '=', 'profiles.current_revision_id')
            ->select([
                'profiles.id',
                'profiles.name',
                'profiles.birth_date',
                'profiles.current_revision_id',
                'profile_revisions.hidden as revision_hidden',
            ])
            ->first();

        if ($profile === null) {
            return new PublicSiteProfileReadResult(null, false);
        }

        if ($profile->current_revision_id === null || (bool) $profile->revision_hidden) {
            return new PublicSiteProfileReadResult([
                'name' => $profile->name,
                'title' => null,
                'location' => null,
                'description' => null,
                'milestones' => [],
                'birth_date' => $profile->birth_date ?? '',
                'birth_city' => null,
                'interests' => null,
                'learning' => null,
                'personal_interests' => [],
            ], false);
        }

        $translation = $this->translation($profile->current_revision_id, $locale);

        return new PublicSiteProfileReadResult([
            'name' => $profile->name,
            'title' => $translation?->title,
            'location' => $translation?->location,
            'description' => $translation?->description,
            'milestones' => $this->rows(
                'profile_revision_milestones',
                'profile_revision_translation_id',
                $translation?->id,
                ['year', 'title', 'description'],
            ),
            'birth_date' => $profile->birth_date ?? '',
            'birth_city' => $translation?->birth_city,
            'interests' => $translation?->interests,
            'learning' => $translation?->learning,
            'personal_interests' => $this->values($translation?->id),
        ], true);
    }

    private function translation(?int $revisionId, string $locale): ?object
    {
        if ($revisionId === null) {
            return null;
        }

        return DB::table('profile_revision_translations')
            ->select([
                'id',
                'locale',
                'title',
                'location',
                'birth_city',
                'description',
                'interests',
                'learning',
            ])
            ->where('profile_revision_id', $revisionId)
            ->whereIn('locale', array_values(array_unique([$locale, 'en'])))
            ->orderByRaw('case when locale = ? then 0 else 1 end', [$locale])
            ->first();
    }

    private function rows(string $table, string $foreignKey, ?int $translationId, array $columns): array
    {
        if ($translationId === null) {
            return [];
        }

        return DB::table($table)
            ->select($columns)
            ->where($foreignKey, $translationId)
            ->where(fn ($visibility) => $visibility
                ->where('hidden', false)
                ->orWhereNull('hidden'))
            ->orderBy('sort_order')
            ->get()
            ->map(static fn (object $row): array => collect((array) $row)
                ->mapWithKeys(static fn (mixed $value, string $key): array => [Str::camel($key) => $value])
                ->all())
            ->all();
    }

    private function values(?int $translationId): array
    {
        if ($translationId === null) {
            return [];
        }

        return DB::table('profile_revision_interests')
            ->where('profile_revision_translation_id', $translationId)
            ->orderBy('sort_order')
            ->pluck('value')
            ->map(static fn (mixed $value): array => ['value' => $value])
            ->all();
    }
}
