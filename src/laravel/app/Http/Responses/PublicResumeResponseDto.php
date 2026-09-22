<?php

namespace App\Http\Responses;

final readonly class PublicResumeResponseDto
{
    private function __construct(
        private string|array|null $summary,
        private string|array|null $leadership,
        private string|array|null $education,
        private string|array|null $certificates,
        private string|array|null $certifications,
        private string|array|null $publications,
        private string|array|null $recommendations,
        private string|array|null $technicalProductions,
        private string|array|null $events,
        private string|array|null $awards,
        private array $experience,
        private array $selectedCases,
        private array $skills,
        private array $languages,
    ) {}

    public static function fromFields(
        string|array|null $summary,
        string|array|null $leadership,
        string|array|null $education,
        string|array|null $certificates,
        string|array|null $certifications,
        string|array|null $publications,
        string|array|null $recommendations,
        string|array|null $technicalProductions,
        string|array|null $events,
        string|array|null $awards,
        array $experience,
        array $selectedCases,
        array $skills,
        array $languages,
    ): self {
        return new self(
            $summary,
            $leadership,
            $education,
            $certificates,
            $certifications,
            $publications,
            $recommendations,
            $technicalProductions,
            $events,
            $awards,
            $experience,
            $selectedCases,
            $skills,
            $languages,
        );
    }

    public function toArray(): array
    {
        return [
            'summary' => $this->summary,
            'leadership' => $this->leadership,
            'education' => $this->education,
            'certificates' => $this->certificates,
            'certifications' => $this->certifications,
            'publications' => $this->publications,
            'recommendations' => $this->recommendations,
            'technical_productions' => $this->technicalProductions,
            'events' => $this->events,
            'awards' => $this->awards,
            'experience' => $this->experience,
            'selected_cases' => $this->selectedCases,
            'skills' => $this->skills,
            'languages' => $this->languages,
        ];
    }
}
