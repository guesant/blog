<?php

namespace App\ReadModel\PublicSite\Email;

interface PublicEmailChallengeReader
{
    public function read(): ?array;
}
