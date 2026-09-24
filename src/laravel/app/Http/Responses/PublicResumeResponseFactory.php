<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicResumeQueryResult;
use App\Content\Locale;
use App\Content\PublicIdentifier;

final class PublicResumeResponseFactory
{
    public function fromResult(GetPublicResumeQueryResult $result): PublicResumeResponseDto
    {
        $translation = $result->resume?->translation($result->locale);
        $profileTranslation = $result->profile?->translation($result->locale);

        return PublicResumeResponseDto::fromFields(
            summary: $translation?->summary,
            leadership: $translation?->leadership ?? [],
            education: $translation?->education ?? [],
            certificates: $translation?->certificates ?? [],
            certifications: $translation?->certifications ?? [],
            publications: $translation?->publications ?? [],
            recommendations: $translation?->recommendations ?? [],
            technicalProductions: $translation?->technical_productions ?? [],
            events: $translation?->events ?? [],
            awards: $translation?->awards ?? [],
            experience: collect($profileTranslation?->trajectory ?? [])
                ->filter(fn ($item) => ! ($item['hidden'] ?? false) && ($item['includeInResume'] ?? false))
                ->values()
                ->all(),
            selectedCases: $result->resume?->selectedCases
                ->sortBy('pivot.order')
                ->map(fn (object $case) => $this->caseStudy($case, $result->locale))
                ->values()
                ->all() ?? [],
            skills: $result->resume?->skills
                ->sortBy('order')
                ->map(fn ($skill) => [
                    'name' => $skill->topic?->translation($result->locale)?->name ?? $skill->topic?->slug,
                    'technologies' => $skill->technologies->map(fn ($technology) => [
                        'slug' => $technology->slug,
                        'name' => $technology->translation($result->locale)?->name ?? $technology->slug,
                        'code' => null,
                        'url' => null,
                        'skills' => null,
                        'resume_skills' => null,
                    ])->values(),
                ])->values()
                ->all() ?? [],
            languages: $result->resume?->languages
                ->sortBy('order')
                ->map(fn ($language) => [
                    'name' => $language->language?->translation($result->locale)?->name ?? $language->language?->slug,
                    'proficiency' => $language->proficiency ?? '',
                ])->values()
                ->all() ?? [],
        );
    }

    private function caseStudy(object $case, string $locale): array
    {
        $translation = $case->translation($locale);

        return [
            'slug' => $case->slug,
            'url' => Locale::url('/cases/'.PublicIdentifier::key($case), $locale),
            'title' => $translation?->title ?? $case->slug,
            'status' => $translation?->status,
            'summary' => $translation?->summary,
            'published_at' => $case->published_at?->toDateString(),
            'external' => $case->external,
            'meta' => $translation?->meta,
            'context' => $translation?->context,
            'role' => $translation?->role,
            'result' => $translation?->result,
            'metrics' => $translation?->metrics,
            'body' => $translation?->body,
            'technologies' => $case->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'show_history' => $case->show_history,
            'history' => null,
            'href' => $case->href,
            'related' => null,
            'updated_at' => $case->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
