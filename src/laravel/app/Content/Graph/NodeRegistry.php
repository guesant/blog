<?php

namespace App\Content\Graph;

use App\Models\CaseStudy;
use App\Models\Experiment;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
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
            'finding' => Resource::class,
            'writing' => Writing::class,
            'case-study' => CaseStudy::class,
            'project' => Project::class,
            'experiment' => Experiment::class,
            'snippet' => Snippet::class,
            'collection' => ReferenceCollection::class,
        ];
    }

    public static function classFor(string $kind): ?string
    {
        return self::kinds()[$kind] ?? null;
    }

    public static function kindFor(object|string $model): ?string
    {
        $class = is_object($model) ? get_class($model) : $model;

        foreach (self::kinds() as $kind => $kindClass) {
            if ($kindClass === $class) {
                return $kind;
            }
        }

        return null;
    }

    public static function morphMap(): array
    {
        return self::kinds();
    }
}
