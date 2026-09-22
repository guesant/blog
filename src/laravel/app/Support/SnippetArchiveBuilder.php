<?php

namespace App\Support;

use RuntimeException;
use ZipArchive;

class SnippetArchiveBuilder
{
    private const MAXIMUM_FILES = 100;

    private const MAXIMUM_FILE_BYTES = 2 * 1024 * 1024;

    private const MAXIMUM_ARCHIVE_BYTES = 10 * 1024 * 1024;

    public function build(object $snippet, array $selectedFileIds = []): string
    {
        $files = $snippet->files;

        if ($selectedFileIds !== []) {
            $files = $files->whereIn('id', $selectedFileIds)->values();
        }

        if ($files->count() > self::MAXIMUM_FILES) {
            throw new RuntimeException('snippet contains too many files');
        }

        $path = tempnam(sys_get_temp_dir(), 'snippet-');
        if ($path === false) {
            throw new RuntimeException('could not create snippet archive');
        }
        $archive = new ZipArchive;
        if ($archive->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            // nosemgrep: php.lang.security.unlink-use.unlink-use
            unlink($path);
            throw new RuntimeException('could not create snippet archive');
        }

        $paths = [];
        $totalBytes = 0;

        foreach ($files as $file) {
            $normalizedPath = $this->normalizePath((string) $file->path);
            $content = (string) $file->content;
            $bytes = strlen($content);

            if ($bytes > self::MAXIMUM_FILE_BYTES || $totalBytes + $bytes > self::MAXIMUM_ARCHIVE_BYTES) {
                $archive->close();
                // nosemgrep: php.lang.security.unlink-use.unlink-use
                unlink($path);
                throw new RuntimeException('snippet files exceed the download size limit');
            }

            if (isset($paths[$normalizedPath])) {
                $archive->close();
                // nosemgrep: php.lang.security.unlink-use.unlink-use
                unlink($path);
                throw new RuntimeException('snippet contains duplicate file paths');
            }

            $paths[$normalizedPath] = true;
            $archive->addFromString($normalizedPath, $content);
            $totalBytes += $bytes;
        }

        if ($archive->close() !== true) {
            // nosemgrep: php.lang.security.unlink-use.unlink-use
            unlink($path);
            throw new RuntimeException('could not finalize snippet archive');
        }
        $contents = file_get_contents($path);
        // nosemgrep: php.lang.security.unlink-use.unlink-use
        unlink($path);
        if ($contents === false) {
            throw new RuntimeException('could not read snippet archive');
        }

        return $contents;
    }

    private function normalizePath(string $path): string
    {
        if ($path === '' || str_contains($path, "\0")) {
            throw new RuntimeException('snippet contains an invalid file path');
        }

        $normalized = str_replace('\\', '/', $path);
        if (str_starts_with($normalized, '/') || str_contains($normalized, ':')) {
            throw new RuntimeException('snippet contains an unsafe file path');
        }

        $segments = explode('/', $normalized);
        if (in_array('', $segments, true) || in_array('.', $segments, true) || in_array('..', $segments, true)) {
            throw new RuntimeException('snippet contains an unsafe file path');
        }

        $normalized = implode('/', $segments);
        if (strlen($normalized) > 240) {
            throw new RuntimeException('snippet contains an excessively long file path');
        }

        return $normalized;
    }
}
