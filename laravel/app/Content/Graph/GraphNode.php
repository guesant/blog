<?php

namespace App\Content\Graph;

use Illuminate\Database\Eloquent\Builder;

interface GraphNode
{
    public static function graphKind(): string;

    public static function graphNodesQuery(): Builder;

    public function graphLabel(string $locale): string;

    public function graphUrl(string $locale): ?string;

    public function graphMeta(): array;

    public function graphIsVisible(): bool;
}
