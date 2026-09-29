<?php

namespace App\Filament\Concerns;

use Filament\Forms\Components\MarkdownEditor;

trait BuildsMarkdownEditors
{
    protected static function markdownEditor(string $name): MarkdownEditor
    {
        $disk = (string) config('filesystems.default');

        return MarkdownEditor::make($name)
            ->columnSpanFull()
            ->fileAttachmentsDisk($disk === 'local' ? 'public' : $disk)
            ->fileAttachmentsDirectory('content-attachments')
            ->getFileAttachmentUrlUsing(function (mixed $file): ?string {
                if (! is_string($file) || $file === '') {
                    return null;
                }

                return rtrim((string) config('portfolio.public_media_url'), '/').'/'.ltrim($file, '/');
            });
    }
}
