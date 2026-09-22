<?php

namespace App\Events;

use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

final class PublicSiteContentChanged implements ShouldDispatchAfterCommit
{
    public static function dispatch(): void
    {
        event(new self);
    }
}
