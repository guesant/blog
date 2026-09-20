<?php

namespace App\Support;

class EntryKindIcon
{
    public static function for(?string $category, ?string $type = null): ?array
    {
        return match ($category) {
            'writing' => ['set' => 'lucide', 'name' => 'pen-line'],
            'case' => ['set' => 'lucide', 'name' => 'briefcase'],
            'project' => ['set' => 'lucide', 'name' => 'layout-grid'],
            'experiment' => ['set' => 'lucide', 'name' => 'activity'],
            'finding' => self::forFindingType($type),
            default => null,
        };
    }

    private static function forFindingType(?string $type): array
    {
        return match ($type) {
            'book' => ['set' => 'lucide', 'name' => 'book-open'],
            'article' => ['set' => 'lucide', 'name' => 'file-text'],
            'paper' => ['set' => 'lucide', 'name' => 'file-text'],
            'repo' => ['set' => 'lucide', 'name' => 'folder-git-2'],
            'site' => ['set' => 'lucide', 'name' => 'globe'],
            'docs' => ['set' => 'lucide', 'name' => 'book-open'],
            'tool' => ['set' => 'phosphor', 'name' => 'wrench'],
            'course' => ['set' => 'lucide', 'name' => 'graduation-cap'],
            'video' => ['set' => 'lucide', 'name' => 'play-circle'],
            'playlist' => ['set' => 'lucide', 'name' => 'list'],
            default => ['set' => 'lucide', 'name' => 'lightbulb'],
        };
    }
}
