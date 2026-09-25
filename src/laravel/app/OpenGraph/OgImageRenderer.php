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
        $this->text($image, $label, $regularFont, $muted, 22, 72, 92, 1040, 1);
        $this->text($image, $payload->title, $boldFont, $foreground, 52, 72, 202, 1040, 2);

        if ($payload->description !== null) {
            $this->text($image, $payload->description, $regularFont, $muted, 26, 72, 390, 1040, 4);
        }

        $this->text($image, 'guesant.net', $boldFont, $foreground, 24, 72, $height - 34, 1040, 1);

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
            imagestring($image, 5, $x, max(0, $baseline - $size), $value, $color);

            return;
        }

        $lines = [];
        $line = '';
        foreach (preg_split('/\s+/u', trim($value)) ?: [] as $word) {
            $candidate = $line === '' ? $word : $line.' '.$word;
            $box = imagettfbbox($size, 0, $font, $candidate);
            $candidateWidth = abs($box[2] - $box[0]);
            if ($line !== '' && $candidateWidth > $maxWidth) {
                $lines[] = $line;
                $line = $word;

                continue;
            }

            $line = $candidate;
        }

        if ($line !== '') {
            $lines[] = $line;
        }

        foreach (array_slice($lines, 0, $maxLines) as $index => $text) {
            imagettftext($image, $size, 0, $x, $baseline + $index * (int) ($size * 1.35), $color, $font, $text);
        }
    }
}
