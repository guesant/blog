<?php

namespace App\ReadModel\PublicSite\Email;

use App\Application\PublicSite\Ports\PublicEmailChallengeReader;
use App\Support\ProtectedEmail;
use Illuminate\Support\Facades\DB;

final class PublicEmailChallengeSqlReader implements PublicEmailChallengeReader
{
    public function read(): ?array
    {
        $email = DB::table('site_settings')
            ->select('contact_email')
            ->value('contact_email');

        return is_string($email) && $email !== ''
            ? ProtectedEmail::encode($email)
            : null;
    }
}
