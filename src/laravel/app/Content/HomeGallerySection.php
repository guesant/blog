<?php

namespace App\Content;

final class HomeGallerySection
{
    public const DEFAULTS = [
        'highlights' => true,
        'feed' => true,
        'portfolio-cases' => true,
        'portfolio-projects' => true,
        'portfolio-experiments' => true,
        'portfolio-collections' => true,
        'portfolio-snippets' => true,
        'portfolio-technologies' => true,
        'portfolio-topics' => true,
        'portfolio-credits' => true,
        'collection-showcases' => true,
    ];

    public const LABELS = [
        'highlights' => 'Highlights',
        'feed' => 'Feed',
        'portfolio-cases' => 'Portfolio cases',
        'portfolio-projects' => 'Portfolio projects',
        'portfolio-experiments' => 'Portfolio experiments',
        'portfolio-collections' => 'Portfolio collections',
        'portfolio-snippets' => 'Portfolio snippets',
        'portfolio-technologies' => 'Portfolio technologies',
        'portfolio-topics' => 'Portfolio topics',
        'portfolio-credits' => 'Portfolio credits',
        'collection-showcases' => 'Collection showcases',
    ];
}
