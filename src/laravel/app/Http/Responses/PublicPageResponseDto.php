<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicPageQueryResult;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\PublicMediaUrl;

final readonly class PublicPageResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(
        GetPublicPageQueryResult $result,
        OgImageUrlGenerator $ogImages,
        PublicMediaUrl $media,
    ): self {
        $fields = $media->rewrite($result->fields);
        if (! is_array($fields)) {
            $fields = $result->fields;
        }
        $title = is_string($fields['title'] ?? null) ? $fields['title'] : $result->slug;
        $description = is_string($fields['description'] ?? null) ? $fields['description'] : null;
        $template = in_array($result->slug, ['home', 'about'], true) ? 'profile' : 'article';
        $seoImage = is_array($fields['seo'] ?? null) ? $fields['seo']['image'] ?? null : null;
        $fields['og_image_url'] = is_string($seoImage) && trim($seoImage) !== ''
            ? $seoImage
            : $ogImages->generate($template, $title, $description);

        return new self($fields);
    }

    public function toArray(): array
    {
        return $this->value;
    }
}
