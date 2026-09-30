<?php

namespace App\Filament\Concerns;

use App\Support\AdminMediaUrl;
use App\Support\MediaAssetRegistrar;
use Filament\Forms\Components\MarkdownEditor;
use Illuminate\Support\Facades\Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

trait BuildsMarkdownEditors
{
    protected static function markdownEditor(string $name): MarkdownEditor
    {
        $disk = (string) config('filesystems.default');

        return MarkdownEditor::make($name)
            ->columnSpanFull()
            ->fileAttachmentsDisk($disk)
            ->fileAttachmentsDirectory('content-attachments')
            ->saveUploadedFileAttachmentUsing(function (TemporaryUploadedFile $file) use ($disk): string {
                $path = $file->store('content-attachments', $disk);
                rescue(
                    fn () => Storage::disk($disk)->setVisibility($path, 'private'),
                    report: false,
                );
                $realPath = $file->getRealPath();
                $checksum = is_string($realPath) ? hash_file('sha256', $realPath) : false;

                app(MediaAssetRegistrar::class)->register(
                    disk: $disk,
                    path: $path,
                    originalName: $file->getClientOriginalName(),
                    mimeType: $file->getMimeType(),
                    size: $file->getSize(),
                    checksum: is_string($checksum) ? $checksum : null,
                );

                return $path;
            })
            ->getFileAttachmentUrlUsing(function (mixed $file): ?string {
                if (! is_string($file) || $file === '') {
                    return null;
                }

                return app(AdminMediaUrl::class)->forPath($file, (string) config('filesystems.default'))
                    ?? app(AdminMediaUrl::class)->forPath($file);
            });
    }
}
