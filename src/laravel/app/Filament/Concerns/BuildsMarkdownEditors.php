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

                if ($path === false) {
                    throw new \RuntimeException('Unable to store the uploaded attachment.');
                }

                rescue(
                    fn () => Storage::disk($disk)->setVisibility($path, 'public'),
                    report: false,
                );
                $realPath = $file->getRealPath();
                $checksum = hash_file('sha256', $realPath);

                app(MediaAssetRegistrar::class)->register(
                    disk: $disk,
                    path: $path,
                    originalName: $file->getClientOriginalName(),
                    mimeType: $file->getMimeType(),
                    size: $file->getSize(),
                    checksum: $checksum === false ? null : $checksum,
                    visibility: 'public',
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
