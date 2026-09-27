<?php

namespace App\OpenGraph;

final class OgImageRenderer
{
    public function render(OgPayload $payload): string
    {
        if (! function_exists('imagecreatetruecolor') || ! function_exists('imagettftext')) {
            throw new \RuntimeException('The GD extension with TrueType support is required.');
        }

        $width = (int) config('og.width');
        $height = (int) config('og.height');
        $image = imagecreatetruecolor($width, $height);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        $background = imagecolorallocate($image, 17, 19, 26);
        $foreground = imagecolorallocate($image, 244, 246, 248);
        $muted = imagecolorallocate($image, 164, 174, 188);
        $accent = imagecolorallocate($image, 76, 134, 255);
        imagefill($image, 0, 0, $background);

        imagefilledrectangle($image, 0, 0, 16, $height, $accent);
        imageline($image, 72, 124, $width - 72, 124, $accent);
        imageline($image, 72, $height - 72, $width - 72, $height - 72, $muted);

        $regularFont = (string) config('og.font_regular');
        $boldFont = (string) config('og.font_bold');
        $label = strtoupper($payload->template);
        $this->text($image, $label, $regularFont, $muted, 24, 72, 92, 1040, 1);
        $this->text($image, $payload->title, $boldFont, $foreground, 64, 72, 208, 1040, 2);

        if ($payload->description !== null) {
            $this->text($image, $payload->description, $regularFont, $muted, 30, 72, 360, 1040, 5);
        }

        $this->text($image, 'guesant.net', $boldFont, $foreground, 28, 72, $height - 34, 1040, 1);

        ob_start();
        imagepng($image, null, 6);
        $contents = ob_get_clean();
        imagedestroy($image);

        if (! is_string($contents)) {
            throw new \RuntimeException('The OG image could not be encoded as PNG.');
        }

        return $contents;
    }

    private function text(
        \GdImage $image,
        string $value,
        string $font,
        int $color,
        int $size,
        int $x,
        int $baseline,
        int $maxWidth,
        int $maxLines,
    ): void {
        if (! is_file($font)) {
            throw new \RuntimeException("The OG font file does not exist: {$font}");
        }

        $lines = $this->wrap($value, $font, $size, $maxWidth);
        $truncated = count($lines) > $maxLines;
        $lines = array_slice($lines, 0, $maxLines);
        if ($truncated && $lines !== []) {
            $last = array_pop($lines);
            $lines[] = $this->appendEllipsis((string) $last, $font, $size, $maxWidth);
        }

        foreach ($lines as $index => $text) {
            imagettftext($image, $size, 0, $x, $baseline + $index * (int) ($size * 1.35), $color, $font, $text);
        }
    }

    private function wrap(string $value, string $font, int $size, int $maxWidth): array
    {
        $lines = [];
        $line = '';

        foreach (preg_split('/\s+/u', trim($value)) ?: [] as $word) {
            foreach ($this->splitWord($word, $font, $size, $maxWidth) as $part) {
                $candidate = $line === '' ? $part : $line.' '.$part;
                if ($line !== '' && $this->textWidth($candidate, $font, $size) > $maxWidth) {
                    $lines[] = $line;
                    $line = $part;

                    continue;
                }

                $line = $candidate;
            }
        }

        if ($line !== '') {
            $lines[] = $line;
        }

        return $lines;
    }

    private function splitWord(string $word, string $font, int $size, int $maxWidth): array
    {
        if ($this->textWidth($word, $font, $size) <= $maxWidth) {
            return [$word];
        }

        $parts = [];
        $part = '';
        foreach (preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY) ?: [] as $character) {
            $candidate = $part.$character;
            if ($part !== '' && $this->textWidth($candidate, $font, $size) > $maxWidth) {
                $parts[] = $part;
                $part = $character;

                continue;
            }

            $part = $candidate;
        }

        if ($part !== '') {
            $parts[] = $part;
        }

        return $parts;
    }

    private function appendEllipsis(string $line, string $font, int $size, int $maxWidth): string
    {
        $ellipsis = '...';
        $characters = preg_split('//u', $line, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        while ($characters !== [] && $this->textWidth(implode('', $characters).$ellipsis, $font, $size) > $maxWidth) {
            array_pop($characters);
        }

        return rtrim(implode('', $characters)).$ellipsis;
    }

    private function textWidth(string $value, string $font, int $size): int
    {
        $box = imagettfbbox($size, 0, $font, $value);

        return abs($box[2] - $box[0]);
    }
}
