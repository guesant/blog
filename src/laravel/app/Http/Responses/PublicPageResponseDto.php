<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicPageQueryResult;
use App\OpenGraph\OgImageUrlGenerator;

final readonly class PublicPageResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(GetPublicPageQueryResult $result, OgImageUrlGenerator $ogImages): self
    {
        $fields = $result->fields;
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
