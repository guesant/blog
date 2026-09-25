<?php

namespace App\OpenGraph;

final class OgImageUrlGenerator
{
    public function __construct(
        private readonly OgPayloadEncoder $encoder,
        private readonly OgImageUrlSigner $signer,
    ) {}

    public function generate(
        string $template,
        ?string $title,
        ?string $description = null,
        ?string $image = null,
    ): ?string {
        if (! $this->enabled() || ! is_string($title) || trim($title) === '') {
            return null;
        }

        $payload = new OgPayload(
            1,
            $template,
            $this->limit($title, (int) config('og.max_title_length')),
            $this->optionalLimit($description, (int) config('og.max_description_length')),
            $image,
        );
        $encodedPayload = $this->encoder->encode($payload);

        return rtrim((string) config('og.base_url'), '/').'/og/'.$encodedPayload.'/'.$this->signer->signature($encodedPayload).'.png';
    }

    public function enabled(): bool
    {
        return (bool) config('og.enabled')
            && is_string(config('og.secret'))
            && config('og.secret') !== ''
            && is_string(config('og.base_url'))
            && config('og.base_url') !== '';
    }

    private function limit(string $value, int $maximum): string
    {
        return mb_substr(trim($value), 0, max(1, $maximum));
    }

    private function optionalLimit(?string $value, int $maximum): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return $this->limit($value, $maximum);
    }
}
