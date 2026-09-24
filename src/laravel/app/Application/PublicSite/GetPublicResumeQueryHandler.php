<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\ProfileReader;
use App\ReadModel\PublicSite\Content\ResumeReader;

final class GetPublicResumeQueryHandler
{
    public function __construct(
        private readonly ProfileReader $profiles,
        private readonly ResumeReader $resumes,
    ) {}

    public function handle(GetPublicResumeQuery $query): GetPublicResumeQueryResult
    {
        return new GetPublicResumeQueryResult(
            profile: $this->profiles->find(),
            resume: $this->resumes->find(),
            locale: $query->locale,
        );
    }
}
