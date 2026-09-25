<?php

namespace App\OpenGraph;

final class OgPayloadValidator
{
    private const TEMPLATES = ['article', 'project', 'profile'];

    public function validate(array $value): OgPayload
    {
        $allowed = ['v', 'template', 'title', 'description', 'image'];
        $unknown = array_diff(array_keys($value), $allowed);
        if ($unknown !== []) {
            throw new OgPayloadValidationException('The payload contains unknown fields.');
        }

        if (($value['v'] ?? null) !== 1) {
            throw new OgPayloadValidationException('The payload version is not supported.');
        }

        $template = $value['template'] ?? null;
        if (! is_string($template) || ! in_array($template, self::TEMPLATES, true)) {
            throw new OgPayloadValidationException('The payload template is not supported.');
        }

        $title = $this->stringField($value, 'title', 1, (int) config('og.max_title_length'));
        $description = $this->optionalStringField(
            $value,
            'description',
            (int) config('og.max_description_length'),
        );
        $image = $this->optionalImageField($value);

        return new OgPayload(1, $template, $title, $description, $image);
    }

    private function stringField(array $value, string $field, int $minimum, int $maximum): string
    {
        $content = $value[$field] ?? null;
        if (! is_string($content)) {
            throw new OgPayloadValidationException("The {$field} field must be a string.");
        }

        $content = trim($content);
        $length = mb_strlen($content);
        if ($length < $minimum || $length > $maximum) {
            throw new OgPayloadValidationException("The {$field} field has an invalid length.");
        }

        return $content;
    }

    private function optionalStringField(array $value, string $field, int $maximum): ?string
    {
        if (! array_key_exists($field, $value) || $value[$field] === null) {
            return null;
        }

        return $this->stringField($value, $field, 1, $maximum);
    }

    private function optionalImageField(array $value): ?string
    {
        if (! array_key_exists('image', $value) || $value['image'] === null) {
            return null;
        }

        $image = $this->stringField($value, 'image', 1, (int) config('og.max_image_length'));
        $url = parse_url($image);
        $baseUrl = parse_url((string) config('og.base_url'));

        if (! is_array($url) || ! is_array($baseUrl) || ($url['scheme'] ?? '') !== 'https') {
            throw new OgPayloadValidationException('The image URL is not allowed.');
        }

        if (($url['host'] ?? null) !== ($baseUrl['host'] ?? null)) {
            throw new OgPayloadValidationException('The image URL host is not allowed.');
        }

        return $image;
    }
}
