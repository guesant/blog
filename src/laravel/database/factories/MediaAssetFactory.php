<?php

namespace Database\Factories;

use App\Models\MediaAsset;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MediaAssetFactory extends Factory
{
    protected $model = MediaAsset::class;

    public function definition(): array
    {
        $path = 'content-attachments/'.Str::uuid().'.png';

        return [
            'disk' => 's3',
            'path' => $path,
            'original_name' => 'attachment.png',
            'mime_type' => 'image/png',
            'size' => 0,
            'checksum' => hash('sha256', $path),
            'visibility' => 'public',
            'last_referenced_at' => null,
        ];
    }
}
