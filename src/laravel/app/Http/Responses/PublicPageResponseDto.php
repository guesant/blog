<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicPageQueryResult;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\PublicMediaUrl;

final readonly class PublicPageResponseDto
{
    private const COMMON_FIELDS = ['title', 'description', 'updated_at'];

    private const PAGE_FIELDS = [
        'about' => [
            'lead', 'context', 'introduction', 'timelineTitle', 'timelineDescription', 'storyTitle', 'story',
        ],
        'contact' => ['contact', 'contactTitle', 'contactDescription'],
        'follow' => [
            'intro', 'sectionLabel', 'sectionTitle', 'futureLabel', 'futureTitle', 'plannedLabel', 'entries',
            'future_entries', 'rssTitle', 'rssDescription', 'atomTitle', 'atomDescription', 'jsonfeedTitle',
            'jsonfeedDescription', 'apiTitle', 'apiDescription', 'sitemapTitle', 'sitemapDescription',
            'robotsTitle', 'robotsDescription', 'webfingerTitle', 'webfingerDescription', 'activitypubTitle',
            'activitypubDescription', 'websubTitle', 'websubDescription', 'webmentionTitle',
            'webmentionDescription',
        ],
        'home' => [
            'heroIdentity', 'heroExperience', 'heroCurrentFocus', 'availableLabel', 'unavailableLabel',
            'experienceTitle', 'experienceDescription', 'currentlyExploringLabel', 'recurringTechnologiesLabel',
            'workTitle', 'workDescription', 'projectsTitle', 'projectsDescription', 'experimentsSummary',
            'writingTitle', 'writingDescription', 'contactTitle', 'contactDescription', 'recurringTechnologies',
        ],
        'license' => [
            'sectionLabel', 'sectionTitle', 'codeHeading', 'codeBody', 'contentHeading', 'contentBody',
            'aiHeading', 'aiBody', 'contact',
        ],
        'now' => ['entries'],
        'portfolio' => [
            'heroIdentity', 'heroExperience', 'heroCurrentFocus', 'availableLabel', 'unavailableLabel',
            'experienceTitle', 'experienceDescription', 'workTitle', 'workDescription', 'projectsTitle',
            'projectsDescription', 'experimentsSummary', 'recurringTechnologies',
        ],
        'projects' => ['selectedLabel', 'archiveLabel', 'experimentsTitle'],
        'resume' => [],
    ];

    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(
        GetPublicPageQueryResult $result,
        OgImageUrlGenerator $ogImages,
        PublicMediaUrl $media,
    ): self {
        $allowedFields = array_values(array_unique([
            ...self::COMMON_FIELDS,
            ...(self::PAGE_FIELDS[$result->slug] ?? []),
        ]));
        $safeFields = array_intersect_key($result->fields, array_flip($allowedFields));
        $fields = $media->rewrite($safeFields);
        if (! is_array($fields)) {
            $fields = $safeFields;
        }
        $title = is_string($fields['title'] ?? null) ? $fields['title'] : $result->slug;
        $description = is_string($fields['description'] ?? null) ? $fields['description'] : null;
        $template = in_array($result->slug, ['home', 'about'], true) ? 'profile' : 'article';
        $fields['og_image_url'] = $ogImages->generate($template, $title, $description);

        return new self($fields);
    }

    public function toArray(): array
    {
        return $this->value;
    }
}
