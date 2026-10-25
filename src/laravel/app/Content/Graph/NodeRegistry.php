<?php

namespace App\Content\Graph;

use App\Models\ReferenceCollection;
use App\Models\Snippet;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;

final class NodeRegistry
{
    public static function kinds(): array
    {
        return [
            'topic' => Topic::class,
            'technology' => Technology::class,
            'writing' => Writing::class,
            'snippet' => Snippet::class,
            'collection' => ReferenceCollection::class,
        ];
    }

    public static function classFor(string $kind): ?string
    {
        return self::kinds()[$kind] ?? null;
    }

    public static function morphMap(): array
    {
        return self::kinds();
    }
}
