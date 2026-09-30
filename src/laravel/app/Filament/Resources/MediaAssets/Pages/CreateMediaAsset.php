<?php

namespace App\Filament\Resources\MediaAssets\Pages;

use App\Filament\Resources\MediaAssets\MediaAssetResource;
use App\Models\MediaAsset;
use Filament\Resources\Pages\CreateRecord;

/**
 * @extends CreateRecord<MediaAsset>
 */
class CreateMediaAsset extends CreateRecord
{
    protected static string $resource = MediaAssetResource::class;
}
