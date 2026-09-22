<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Email\PublicEmailChallengeReader;

final class GetPublicEmailChallengeHandler
{
    public function __construct(
        private readonly PublicEmailChallengeReader $email,
    ) {}

    public function handle(GetPublicEmailChallenge $query): PublicEmailChallengeReadResult
    {
        return new PublicEmailChallengeReadResult($this->email->read());
    }
}
