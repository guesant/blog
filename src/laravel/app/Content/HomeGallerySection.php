<?php

namespace App\Content;

final class HomeGallerySection
{
    public const DEFAULTS = [
        'highlights' => true,
        'recent-writing' => true,
        'recent-findings' => true,
        'recent-collections' => true,
        'popular-writing' => true,
        'popular-findings' => false,
        'popular-collections' => true,
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
        'recent-writing' => 'Recent writing',
        'recent-findings' => 'Recent findings',
        'recent-collections' => 'Recent collections',
        'popular-writing' => 'Popular writing',
        'popular-findings' => 'Popular findings',
        'popular-collections' => 'Popular collections',
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
