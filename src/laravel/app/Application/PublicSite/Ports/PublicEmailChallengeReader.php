<?php

namespace App\Application\PublicSite\Ports;

interface PublicEmailChallengeReader
{
    public function read(): ?array;
}
