<?php

namespace App\Http\Responses;

final readonly class PublicListMetaDto
{
    private function __construct(
        private int $page,
        private int $perPage,
        private int $total,
        private int $lastPage,
        private ?int $from,
        private ?int $to,
        private string $locale,
        private ?array $facets,
    ) {}

    public static function fromPage(
        object $page,
        string $locale,
        ?array $facets = null,
    ): self {
        return new self(
            page: $page->currentPage(),
            perPage: $page->perPage(),
            total: $page->total(),
            lastPage: $page->lastPage(),
            from: $page->firstItem(),
            to: $page->lastItem(),
            locale: $locale,
            facets: $facets,
        );
    }

    public function toArray(): array
    {
        $value = [
            'page' => $this->page,
            'per_page' => $this->perPage,
            'total' => $this->total,
            'last_page' => $this->lastPage,
            'from' => $this->from,
            'to' => $this->to,
            'locale' => $this->locale,
        ];

        if ($this->facets !== null) {
            $value['facets'] = $this->facets;
        }

        return $value;
    }
}
