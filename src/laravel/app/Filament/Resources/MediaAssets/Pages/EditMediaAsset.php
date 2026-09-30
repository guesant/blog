<?php

namespace App\Filament\Resources\MediaAssets\Pages;

use App\Filament\Resources\MediaAssets\MediaAssetResource;
use App\Models\MediaAsset;
use Filament\Resources\Pages\EditRecord;

/**
 * @extends EditRecord<MediaAsset>
 */
class EditMediaAsset extends EditRecord
{
    protected static string $resource = MediaAssetResource::class;

}
