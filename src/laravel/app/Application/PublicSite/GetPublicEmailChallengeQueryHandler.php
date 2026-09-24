<?php

namespace App\Application\PublicSite;

use App\Application\PublicSite\Ports\PublicEmailChallengeReader;

final class GetPublicEmailChallengeQueryHandler
{
    public function __construct(
        private readonly PublicEmailChallengeReader $email,
    ) {}

    public function handle(GetPublicEmailChallengeQuery $query): GetPublicEmailChallengeQueryResult
    {
        return new GetPublicEmailChallengeQueryResult($this->email->read());
    }
}
