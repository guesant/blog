<?php

namespace App\Application\PublicSite;

use App\Content\ProfileQuery;
use App\Content\ResumeQuery;

final class GetPublicResumeHandler
{
    public function __construct(
        private readonly ProfileQuery $profiles,
        private readonly ResumeQuery $resumes,
    ) {}

    public function handle(GetPublicResume $query): PublicResumeReadResult
    {
        return new PublicResumeReadResult(
            profile: $this->profiles->find(),
            resume: $this->resumes->find(),
            locale: $query->locale,
        );
    }
}
