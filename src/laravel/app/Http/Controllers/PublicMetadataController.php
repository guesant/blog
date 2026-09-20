<?php

namespace App\Http\Controllers;

use App\Content\Locale;
use App\Content\SiteChromeQuery;
use App\Content\SiteSettingsQuery;
use App\Http\Controllers\Api\PublicSiteApiController;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicMetadataController extends Controller
{
    private const STATIC_PATHS = [
        '/',
        '/about',
        '/portfolio',
        '/projects',
        '/cases',
        '/topics',
        '/technologies',
        '/resume',
        '/contact',
        '/credits',
        '/license',
        '/follow',
        '/snippets',
    ];

    public function robots(): Response
    {
        if ($this->maintenanceEnabled()) {
            return response("User-agent: *\nDisallow: /\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
        }

        $bots = [
            'GPTBot',
            'ChatGPT-User',
            'CCBot',
            'Google-Extended',
            'ClaudeBot',
            'anthropic-ai',
            'Claude-Web',
            'Bytespider',
            'Applebot-Extended',
            'Amazonbot',
            'Meta-ExternalAgent',
            'Diffbot',
            'PerplexityBot',
        ];
        $rules = collect($bots)->map(fn (string $bot) => "User-agent: {$bot}\nDisallow: /")->implode("\n\n");

        return response("User-agent: *\nAllow: /\n\n{$rules}\n\nSitemap: {$this->absolute('/sitemap.xml')}\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function sitemap(): Response
    {
        if ($this->maintenanceEnabled()) {
            return response('', 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
        }

        $urls = [];
        foreach (Locale::all() as $locale) {
            $snapshot = $this->snapshot($locale);
            foreach (self::STATIC_PATHS as $path) {
                $urls[] = $this->absolute(Locale::path($path, $locale));
            }
            foreach (['projects', 'cases', 'writings', 'findings', 'collections', 'topics', 'technologies', 'experiments', 'snippets'] as $key) {
                foreach ($snapshot[$key] ?? [] as $item) {
                    if (filled($item['url'] ?? null)) {
                        $urls[] = $this->absolute((string) $item['url']);
                    }
                }
            }
        }

        $body = collect(array_values(array_unique($urls)))
            ->map(fn (string $url) => '<url><loc>'.$this->xml($url).'</loc></url>')
            ->implode('');
        $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.$body.'</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function feed(Request $request, string $locale, string $format): Response
    {
        $locale = Locale::normalize($locale);
        $snapshot = $this->snapshot($locale);
        $items = $this->feedItems($snapshot);

        if ($format === 'json') {
            return response()->json([
                'version' => 'https://jsonfeed.org/version/1.1',
                'title' => $snapshot['chrome']['profile']['name'] ?? 'Portfolio',
                'home_page_url' => $this->absolute(Locale::path('/', $locale)),
                'feed_url' => $this->absolute(Locale::path('/feed.json', $locale)),
                'language' => $locale,
                'items' => collect($items)->map(fn (array $item) => array_filter([
                    'id' => $item['url'],
                    'url' => $item['url'],
                    'title' => $item['title'],
                    'summary' => $item['excerpt'],
                    'date_published' => $item['date']?->format(DATE_ATOM),
                ], fn ($value) => $value !== null))->values(),
            ], 200, [
                'Content-Type' => 'application/feed+json; charset=UTF-8',
                'Cache-Control' => 'public, max-age=300',
            ]);
        }

        return response($format === 'atom' ? $this->atom($locale, $items) : $this->rss($locale, $items), 200, [
            'Content-Type' => $format === 'atom' ? 'application/atom+xml; charset=UTF-8' : 'application/rss+xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }

    public function webfinger(Request $request): Response
    {
        $account = config('services.webfinger.acct');
        $resource = (string) $request->query('resource');
        if (blank($account)) {
            return response()->json(['error' => 'not_found'], 404);
        }
        if (blank($resource)) {
            return response()->json(['error' => 'resource_required'], 400);
        }

        $home = $this->absolute('/');
        if (! in_array(strtolower($resource), [strtolower("acct:{$account}"), strtolower($home)], true)) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $chrome = (new SiteChromeQuery)->build('en');
        $about = $this->absolute('/about');
        $links = [[
            'rel' => 'http://webfinger.net/rel/profile-page',
            'type' => 'text/html',
            'href' => $about,
        ]];
        foreach ($chrome['siteSettings']?->contactProfiles ?? [] as $profile) {
            if (filled($profile->url)) {
                $links[] = ['rel' => 'me', 'href' => $profile->url];
            }
        }

        return response()->json([
            'subject' => "acct:{$account}",
            'aliases' => [$about],
            'links' => $links,
        ])->header('Content-Type', 'application/jrd+json; charset=UTF-8');
    }

    private function snapshot(string $locale): array
    {
        $request = Request::create('/api/v1/public-site', 'GET', ['locale' => $locale]);
        $response = app(PublicSiteApiController::class)->index($request);
        if ($response->getStatusCode() >= 400) {
            return [];
        }

        return json_decode((string) $response->getContent(), true) ?: [];
    }

    private function feedItems(array $snapshot): array
    {
        $items = collect($snapshot['writings'] ?? [])->map(fn (array $item) => [
            'title' => $item['title'] ?? '',
            'excerpt' => $item['excerpt'] ?? null,
            'raw_date' => $item['date'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ])->concat(collect($snapshot['findings'] ?? [])->filter(fn (array $item) => filled($item['title'] ?? null))->map(fn (array $item) => [
            'title' => $item['title'],
            'excerpt' => $item['personal_note'] ?? $item['reason_found'] ?? $item['description'] ?? null,
            'raw_date' => $item['found_date'] ?? $item['published_date'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ]))->concat(collect($snapshot['collections'] ?? [])->map(fn (array $item) => [
            'title' => $item['title'] ?? '',
            'excerpt' => $item['description'] ?? null,
            'raw_date' => $item['created_at'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ]))->map(function (array $item): array {
            $item['date'] = filled($item['raw_date']) ? (date_create_immutable((string) $item['raw_date']) ?: null) : null;
            unset($item['raw_date']);

            return $item;
        })->sortByDesc(fn (array $item) => $item['date']?->getTimestamp() ?? 0)->take(30)->values()->all();

        return $items;
    }

    private function rss(string $locale, array $items): string
    {
        $home = $this->absolute(Locale::path('/', $locale));
        $feed = $this->absolute(Locale::path('/feed.xml', $locale));
        $entries = collect($items)->map(fn (array $item) => '<item><title>'.$this->xml($item['title']).'</title><link>'.$this->xml($item['url']).'</link><guid isPermaLink="true">'.$this->xml($item['url']).'</guid>'.($item['date'] ? '<pubDate>'.$item['date']->setTimezone(new \DateTimeZone('UTC'))->format(DATE_RSS).'</pubDate>' : '').(filled($item['excerpt']) ? '<description>'.$this->xml($item['excerpt']).'</description>' : '').'</item>')->implode('');

        return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Portfolio</title><link>'.$this->xml($home).'</link><description>Portfolio</description><language>'.$this->xml($locale).'</language><link xmlns:atom="http://www.w3.org/2005/Atom" href="'.$this->xml($feed).'" rel="self" type="application/rss+xml"/>'.$entries.'</channel></rss>';
    }

    private function atom(string $locale, array $items): string
    {
        $feed = $this->absolute(Locale::path('/atom.xml', $locale));
        $updated = $items[0]['date'] ?? now()->toImmutable();
        $entries = collect($items)->map(fn (array $item) => '<entry><id>'.$this->xml($item['url']).'</id><title>'.$this->xml($item['title']).'</title><link href="'.$this->xml($item['url']).'"/><updated>'.$item['date']?->setTimezone(new \DateTimeZone('UTC'))->format(DATE_ATOM).'</updated>'.(filled($item['excerpt']) ? '<summary>'.$this->xml($item['excerpt']).'</summary>' : '').'</entry>')->implode('');

        return '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>'.$this->xml($feed).'</id><title>Portfolio</title><updated>'.$updated->setTimezone(new \DateTimeZone('UTC'))->format(DATE_ATOM).'</updated><link rel="self" href="'.$this->xml($feed).'"/>'.$entries.'</feed>';
    }

    private function absolute(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return rtrim((string) env('PUBLIC_SITE_BASE_URL', config('app.url')), '/').'/'.ltrim($path, '/');
    }

    private function xml(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }

    private function maintenanceEnabled(): bool
    {
        return (bool) (new SiteSettingsQuery)->find()?->maintenance_enabled;
    }
}
