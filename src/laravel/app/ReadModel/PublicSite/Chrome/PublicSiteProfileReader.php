<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class PublicSiteProfileReader
{
    public function read(string $locale): ?array
    {
        $profile = DB::table('profiles')
            ->select(['id', 'name', 'birth_date', 'current_revision_id'])
            ->first();

        if ($profile === null || $profile->current_revision_id === null) {
            return $profile === null ? null : [
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
            ];
        }

        $translation = $this->translation($profile->current_revision_id, $locale);

        return [
            'name' => $profile->name,
            'title' => $translation?->title,
            'location' => $translation?->location,
            'description' => $translation?->description,
            'milestones' => $this->rows(
                'profile_revision_milestones',
                'profile_revision_translation_id',
                $translation?->id,
                ['year', 'title', 'description', 'hidden'],
            ),
            'birth_date' => $profile->birth_date ?? '',
            'birth_city' => $translation?->birth_city,
            'interests' => $translation?->interests,
            'learning' => $translation?->learning,
            'personal_interests' => $this->values($translation?->id),
        ];
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
