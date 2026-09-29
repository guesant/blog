<?php

namespace App\Filament\Resources\Platforms\Pages;

use App\Filament\Resources\Platforms\PlatformResource;
use App\Models\Platform;
use Filament\Resources\Pages\CreateRecord;

/**
 * @extends CreateRecord<Platform>
 */
class CreatePlatform extends CreateRecord
{
    protected static string $resource = PlatformResource::class;
}
