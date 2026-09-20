<?php

namespace App\Content;

use Illuminate\Support\Facades\File;

final class InterfaceQuery
{
    public function forLocale(string $locale): array
    {
        $document = json_decode(
            File::get(resource_path('content/interface.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        return $document['translations'][$locale === 'pt-BR' ? 'ptBR' : 'en'] ?? [];
    }
}
