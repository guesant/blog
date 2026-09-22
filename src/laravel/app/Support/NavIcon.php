<?php

namespace App\Support;

class NavIcon
{
    private const MAP = [
        'writing' => 'pen-line',
        'findings' => 'lightbulb',
        'topics' => 'layout-list',
        'collections' => 'archive',
        'snippets' => 'copy',
        'tools' => 'wrench',
        'about' => 'user',
        'now' => 'activity',
        'resume' => 'file-text',
        'portfolio' => 'layout-grid',
        'cases' => 'briefcase',
        'projects' => 'folder-git-2',
        'follow' => 'messages-square',
    ];

    private const PHOSPHOR = ['wrench'];

    public static function for(string $route): ?array
    {
        $name = self::MAP[$route] ?? null;

        if (! $name) {
            return null;
        }

        return [
            'name' => $name,
            'set' => in_array($name, self::PHOSPHOR, true) ? 'phosphor' : 'lucide',
        ];
    }
}
