<?php

namespace App\Content;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class OpenGraphMetadata
{
    private const CACHE_KEY = 'content:open-graph:v1';

    private const LOCK_KEY = 'content:open-graph:v1:lock';

    private const USER_AGENT = 'guesant.net content preview/1.0';

    private ?array $entriesCache = null;

    public function forUrl(string $value): ?array
    {
        if (! config('content.open_graph.enabled')) {
            return null;
        }

        $url = $this->normalizedUrl($value);

        if ($url === null) {
            return null;
        }

        $key = hash('sha256', $url);
        $store = Cache::store();
        $cached = $this->cachedEntry($this->cachedEntries($store), $key);

        if ($cached !== null) {
            return $cached['metadata'];
        }

        return null;
    }

    public function refresh(string $value): void
    {
        if (! config('content.open_graph.enabled')) {
            return;
        }

        $url = $this->normalizedUrl($value);

        if ($url === null) {
            return;
        }

        if (! $this->publicHost((string) parse_url($url, PHP_URL_HOST))) {
            return;
        }

        $key = hash('sha256', $url);
        $store = Cache::store();

        try {
            $store->lock(self::LOCK_KEY, 10)->block(2, function () use ($store, $key, $url): void {
                $entries = $this->cachedEntries($store);
                $entries[$key] = [
                    'last_used' => microtime(true),
                    'metadata' => $this->fetch($url),
                ];
                $this->write($store, $entries);
            });
        } catch (Throwable) {
            $entries = $this->cachedEntries($store);
            $entries[$key] = [
                'last_used' => microtime(true),
                'metadata' => null,
            ];
            $this->write($store, $entries);
        }
    }

    private function cachedEntry(mixed $cache, string $key): ?array
    {
        $entry = is_array($cache[$key] ?? null) ? $cache[$key] : null;

        if (! $entry || ! array_key_exists('metadata', $entry)) {
            return null;
        }

        return $entry;
    }

    private function entries(mixed $cache): array
    {
        return is_array($cache['entries'] ?? null) ? $cache['entries'] : [];
    }

    private function cachedEntries($store): array
    {
        return $this->entriesCache ??= $this->entries($store->get(self::CACHE_KEY));
    }

    private function write($store, array $entries): void
    {
        uasort($entries, fn (array $left, array $right) => $left['last_used'] <=> $right['last_used']);
        $maxEntries = max(1, (int) config('content.open_graph.cache_max_entries', 256));
        $entries = array_slice($entries, -$maxEntries, null, true);
        $ttl = max(1, (int) config('content.open_graph.cache_ttl', 604800));

        $this->entriesCache = $entries;
        $store->put(self::CACHE_KEY, ['entries' => $entries], $ttl);
    }

    private function fetch(string $url): ?array
    {
        try {
            $currentUrl = $url;

            for ($redirect = 0; $redirect <= 3; $redirect++) {
                $request = $this->request();
                $response = $request->get($currentUrl);

                if ($response->status() >= 300 && $response->status() < 400) {
                    $location = $response->header('Location');
                    $currentUrl = $location ? $this->resolvedUrl($currentUrl, $location) : null;

                    if ($currentUrl === null) {
                        return null;
                    }

                    continue;
                }

                if (! $response->successful() || ! $this->isHtml($response->header('Content-Type'))) {
                    return null;
                }

                $contentLength = (int) $response->header('Content-Length', 0);
                $maxBytes = max(1024, (int) config('content.open_graph.max_bytes', 262144));

                if ($contentLength > $maxBytes) {
                    return null;
                }

                $body = $response->toPsrResponse()->getBody()->read($maxBytes);

                return $this->parse($body, $currentUrl);
            }
        } catch (Throwable) {
            return null;
        }

        return null;
    }

    private function request(): PendingRequest
    {
        return Http::accept('text/html, application/xhtml+xml')
            ->withUserAgent(self::USER_AGENT)
            ->connectTimeout(max(1, (int) config('content.open_graph.connect_timeout', 2)))
            ->timeout(max(1, (int) config('content.open_graph.fetch_timeout', 3)))
            ->withOptions([
                'allow_redirects' => false,
                'stream' => true,
            ]);
    }

    private function parse(string $body, string $baseUrl): ?array
    {
        if ($body === '' || ! class_exists('DOMDocument')) {
            return null;
        }

        $document = new \DOMDocument;
        $previous = libxml_use_internal_errors(true);
        $loaded = $document->loadHTML($body, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_NONET);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $loaded) {
            return null;
        }

        $metadata = [];
        foreach ($document->getElementsByTagName('meta') as $node) {
            $key = strtolower(trim($node->getAttribute('property') ?: $node->getAttribute('name')));
            $value = trim($node->getAttribute('content'));

            if ($value !== '' && in_array($key, ['og:title', 'og:description', 'og:image', 'og:site_name', 'og:type', 'og:url'], true)) {
                $metadata[$key] = $value;
            }
        }

        $title = $document->getElementsByTagName('title')->item(0)?->textContent;
        $metadata['og:title'] ??= trim((string) $title);

        $result = array_filter([
            'title' => $metadata['og:title'] ?? null,
            'description' => $metadata['og:description'] ?? null,
            'image' => isset($metadata['og:image']) ? $this->resolvedUrl($baseUrl, $metadata['og:image']) : null,
            'site_name' => $metadata['og:site_name'] ?? null,
            'type' => $metadata['og:type'] ?? null,
            'url' => isset($metadata['og:url']) ? $this->resolvedUrl($baseUrl, $metadata['og:url']) : null,
        ], static fn ($value) => is_string($value) && $value !== '');

        return $result !== [] ? $result : null;
    }

    private function isHtml(?string $contentType): bool
    {
        return $contentType === null || str_contains(strtolower($contentType), 'text/html') || str_contains(strtolower($contentType), 'application/xhtml+xml');
    }

    private function normalizedUrl(string $value): ?string
    {
        $url = trim($value);
        $parts = parse_url($url);
        $scheme = strtolower((string) ($parts['scheme'] ?? ''));
        $host = strtolower((string) ($parts['host'] ?? ''));

        if (! in_array($scheme, ['http', 'https'], true) || $host === '' || isset($parts['user'], $parts['pass'])) {
            return null;
        }

        return $url;
    }

    private function publicHost(string $host): bool
    {
        if (in_array($host, ['localhost', 'host.docker.internal'], true) || str_ends_with($host, '.local') || str_ends_with($host, '.localhost') || str_ends_with($host, '.internal') || str_ends_with($host, '.test')) {
            return false;
        }

        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
        }

        $records = @dns_get_record($host, DNS_A | DNS_AAAA);

        if ($records === false || $records === []) {
            return false;
        }

        foreach ($records as $record) {
            $ip = $record['ip'] ?? $record['ipv6'] ?? null;

            if (! is_string($ip) || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                return false;
            }
        }

        return true;
    }

    private function resolvedUrl(string $baseUrl, string $value): ?string
    {
        $value = trim($value);

        if ($value === '') {
            return null;
        }

        $base = parse_url($baseUrl);
        $candidate = parse_url($value);

        if (isset($candidate['scheme'])) {
            return $this->publicUrl($value);
        }

        if (str_starts_with($value, '//')) {
            return $this->publicUrl(($base['scheme'] ?? 'https').':'.$value);
        }

        if (! isset($base['scheme'], $base['host'])) {
            return null;
        }

        $origin = $base['scheme'].'://'.$base['host'].(isset($base['port']) ? ':'.$base['port'] : '');

        if (str_starts_with($value, '/')) {
            return $this->publicUrl($origin.$value);
        }

        $path = $base['path'] ?? '/';
        $directory = str_ends_with($path, '/') ? $path : rtrim(dirname($path), '/').'/';
        $directory = '/'.ltrim($directory, '/');

        return $this->publicUrl($origin.$directory.$value);
    }

    private function publicUrl(string $value): ?string
    {
        $url = $this->normalizedUrl($value);

        if ($url === null || ! $this->publicHost((string) parse_url($url, PHP_URL_HOST))) {
            return null;
        }

        return $url;
    }
}
