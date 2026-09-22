<?php

namespace App\Application\PublicSite;

final readonly class PublicFindingReadResult
{
    public function __construct(public object $resource) {}
}
