<?php

namespace App\ReadModel\PublicSite\Email;

use App\Application\PublicSite\Ports\PublicEmailChallengeReader;
use App\Support\ProtectedEmail;
use Illuminate\Support\Facades\DB;

final class PublicEmailChallengeSqlReader implements PublicEmailChallengeReader
{
    public function read(): ?array
    {
        $settings = DB::table('site_settings as settings')
            ->join('site_settings_revisions as revision', 'revision.id', '=', 'settings.published_revision_id')
            ->select(['revision.contact_enabled', 'revision.contact_email'])
            ->first();

        if ($settings === null || ! (bool) $settings->contact_enabled) {
            return null;
        }

        $email = $settings->contact_email;

        return is_string($email) && $email !== ''
            ? ProtectedEmail::encode($email)
            : null;
    }
}
