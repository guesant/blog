<?php

namespace App\Content\Graph;

trait InteractsWithGraph
{
    public function graphId(): string
    {
        return static::graphKind().':'.$this->slug;
    }

    public function graphMeta(): array
    {
        return [];
    }

    public function graphIsVisible(): bool
    {
        return static::graphNodesQuery()->whereKey($this->getKey())->exists();
    }
}
