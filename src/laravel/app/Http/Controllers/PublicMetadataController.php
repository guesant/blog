<?php

namespace App\Http\Controllers;

use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Application\PublicSite\IsPublicSiteInMaintenanceQuery;
use App\Application\PublicSite\IsPublicSiteInMaintenanceQueryHandler;
use App\Application\PublicSite\ListPublicContentQuery;
use App\Application\PublicSite\ListPublicContentQueryHandler;
use App\Application\PublicSite\ListPublicFindingsQuery;
use App\Application\PublicSite\ListPublicFindingsQueryHandler;
use App\Content\Locale;
use App\Content\PublicFeedCache;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Http\Responses\PublicContentResponseFactory;
use App\Http\Responses\PublicFindingResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class PublicMetadataController extends Controller
{
    public function __construct(
        private readonly GetPublicSiteChromeQueryHandler $chrome,
        private readonly IsPublicSiteInMaintenanceQueryHandler $maintenance,
        private readonly ListPublicContentQueryHandler $content,
        private readonly PublicContentResponseFactory $contentPresenter,
        private readonly ListPublicFindingsQueryHandler $findings,
        private readonly PublicFindingResponseFactory $findingPresenter,
        private readonly PublicFeedCache $feedCache,
    ) {}

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

        $body = Cache::remember('public-metadata:robots', 3600, fn (): string => "User-agent: *\nAllow: /\n\n{$rules}\n\nSitemap: {$this->absolute('/sitemap.xml')}\n");

        return response($body, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function sitemap(): Response
    {
        if ($this->maintenanceEnabled()) {
            return response('', 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
        }

        $xml = Cache::remember('public-metadata:sitemap', 3600, function (): string {
            $urls = [];
            foreach (Locale::all() as $locale) {
                $navigation = $this->chrome
                    ->handle(new GetPublicSiteChromeQuery($locale))
                    ->navigation['sitemap'] ?? [];

                foreach ($this->navigationUrls($navigation) as $url) {
                    $urls[] = $url;
                }
                foreach (['projects', 'cases', 'writing', 'collections', 'topics', 'technologies', 'experiments', 'snippets'] as $collection) {
                    foreach ($this->collectionItems($collection, $locale) as $item) {
                        $this->appendUrl($urls, $item['url'] ?? null);
                    }
                }
                foreach ($this->findingItems($locale) as $item) {
                    $this->appendUrl($urls, $item['url'] ?? null);
                }
            }

            $body = collect(array_values(array_unique($urls)))
                ->map(fn (string $url) => '<url><loc>'.$this->xml($url).'</loc></url>')
                ->implode('');

            return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.$body.'</urlset>';
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    private function navigationUrls(array $items): array
    {
        return collect($items)
            ->flatMap(fn (array $item): array => [
                $this->absolute($item['route']),
                ...$this->navigationUrls($item['children'] ?? []),
            ])
            ->filter()
            ->values()
            ->all();
    }

    public function feed(string $locale, string $format): Response
    {
        $locale = Locale::normalize($locale);

        if ($format === 'json') {
            $payload = $this->feedCache->rememberArray(
                'metadata-json',
                ['locale' => $locale],
                (int) config('portfolio.public_metadata_feed_cache_ttl_seconds', 300),
                function () use ($locale): array {
                    $items = $this->feedItems($locale);

                    return [
                        'version' => 'https://jsonfeed.org/version/1.1',
                        'title' => $this->chrome->handle(new GetPublicSiteChromeQuery($locale))->profile['name'] ?? 'Portfolio',
                        'home_page_url' => $this->absolute(Locale::path('/', $locale)),
                        'feed_url' => $this->absolute(Locale::path('/feed.json', $locale)),
                        'language' => $locale,
                        'items' => collect($items)->map(fn (array $item) => array_filter([
                            'id' => $item['url'],
                            'url' => $item['url'],
                            'title' => $item['title'],
                            'summary' => $item['summary'],
                            'date_published' => $item['date']?->format(DATE_ATOM),
                        ], fn ($value) => $value !== null))->values()->all(),
                    ];
                },
            );

            return response()->json($payload, 200, [
                'Content-Type' => 'application/feed+json; charset=UTF-8',
                'Cache-Control' => 'public, max-age=300',
            ]);
        }

        $body = $this->feedCache->rememberString(
            'metadata-'.$format,
            ['locale' => $locale],
            (int) config('portfolio.public_metadata_feed_cache_ttl_seconds', 300),
            function () use ($locale, $format): string {
                $items = $this->feedItems($locale);

                return $format === 'atom' ? $this->atom($locale, $items) : $this->rss($locale, $items);
            },
        );

        return response($body, 200, [
            'Content-Type' => $format === 'atom' ? 'application/atom+xml; charset=UTF-8' : 'application/rss+xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }

    public function webfinger(Request $request): Response
    {
        $account = config('services.webfinger.acct');
        $resource = (string) $request->query('resource');
        if (blank($account)) {
            return ApiErrorResponse::make(
                ApiErrorCode::NotFound,
                404,
                'The requested resource was not found.',
            );
        }
        if (blank($resource)) {
            return ApiErrorResponse::make(
                ApiErrorCode::ResourceRequired,
                400,
                'The resource query parameter is required.',
            );
        }

        $home = $this->absolute('/');
        if (! in_array(strtolower($resource), [strtolower("acct:{$account}"), strtolower($home)], true)) {
            return ApiErrorResponse::make(
                ApiErrorCode::NotFound,
                404,
                'The requested resource was not found.',
            );
        }

        $chrome = $this->chrome->handle(new GetPublicSiteChromeQuery('en'));
        $about = $this->absolute('/about');
        $links = [[
            'rel' => 'http://webfinger.net/rel/profile-page',
            'type' => 'text/html',
            'href' => $about,
        ]];
        foreach ($chrome->site['contact_profiles'] ?? [] as $profile) {
            if (filled($profile['url'] ?? null)) {
                $links[] = ['rel' => 'me', 'href' => $profile['url']];
            }
        }

        return response()->json([
            'subject' => "acct:{$account}",
            'aliases' => [$about],
            'links' => $links,
        ])->header('Content-Type', 'application/jrd+json; charset=UTF-8');
    }

    private function feedItems(string $locale): array
    {
        $items = collect($this->collectionItems('writing', $locale, 30))->map(fn (array $item) => [
            'title' => $item['title'] ?? '',
            'summary' => $item['excerpt'] ?? null,
            'raw_date' => $item['date'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ])->concat(collect($this->findingItems($locale, 30))->filter(fn (array $item) => filled($item['title'] ?? null))->map(fn (array $item) => [
            'title' => $item['title'],
            'summary' => $item['personal_note'] ?? $item['reason_found'] ?? $item['description'] ?? null,
            'raw_date' => $item['found_date'] ?? $item['published_date'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ]))->concat(collect($this->collectionItems('collections', $locale, 30))->map(fn (array $item) => [
            'title' => $item['title'] ?? '',
            'summary' => $item['description'] ?? null,
            'raw_date' => $item['created_at'] ?? null,
            'url' => $this->absolute($item['url'] ?? '/'),
        ]))->map(function (array $item): array {
            $item['date'] = filled($item['raw_date']) ? (date_create_immutable((string) $item['raw_date']) ?: null) : null;
            unset($item['raw_date']);

            return $item;
        })->sortByDesc(fn (array $item) => $item['date']?->getTimestamp() ?? 0)->take(30)->values()->all();

        return $items;
    }

    private function collectionItems(string $collection, string $locale, int $perPage = 100): array
    {
        $items = [];
        $page = 1;
        $lastPage = 1;

        while ($page <= $lastPage) {
            $result = $this->content->handle(new ListPublicContentQuery(
                collection: $collection,
                locale: $locale,
                perPage: $perPage,
                sort: null,
                featured: false,
                page: $page,
                search: null,
                type: null,
                topic: null,
                kind: null,
            ));

            $items = [
                ...$items,
                ...$result->page->getCollection()
                    ->map(fn (object $item): array => $collection === 'feed'
                        ? $this->contentPresenter->feedItem($item, $locale)
                        : $this->contentPresenter->collectionItem($collection, $item, $locale))
                    ->all(),
            ];
            $lastPage = $result->page->lastPage();
            $page++;
        }

        return $items;
    }

    private function findingItems(string $locale, int $perPage = 100): array
    {
        $items = [];
        $page = 1;
        $lastPage = 1;

        while ($page <= $lastPage) {
            $result = $this->findings->handle(new ListPublicFindingsQuery(
                filters: [],
                locale: $locale,
                perPage: $perPage,
                sort: null,
            ));

            $items = [
                ...$items,
                ...$result->page
                    ->getCollection()
                    ->map(fn (object $item): array => $this->findingPresenter->summary($item, $locale))
                    ->all(),
            ];
            $lastPage = $result->page->lastPage();
            $page++;
        }

        return $items;
    }

    private function appendUrl(array &$urls, mixed $url): void
    {
        if (filled($url)) {
            $urls[] = $this->absolute((string) $url);
        }
    }

    private function rss(string $locale, array $items): string
    {
        $home = $this->absolute(Locale::path('/', $locale));
        $feed = $this->absolute(Locale::path('/feed.xml', $locale));
        $entries = collect($items)->map(fn (array $item) => '<item><title>'.$this->xml($item['title']).'</title><link>'.$this->xml($item['url']).'</link><guid isPermaLink="true">'.$this->xml($item['url']).'</guid>'.($item['date'] ? '<pubDate>'.$item['date']->setTimezone(new \DateTimeZone('UTC'))->format(DATE_RSS).'</pubDate>' : '').(filled($item['summary']) ? '<description>'.$this->xml($item['summary']).'</description>' : '').'</item>')->implode('');

        return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Portfolio</title><link>'.$this->xml($home).'</link><description>Portfolio</description><language>'.$this->xml($locale).'</language><link xmlns:atom="http://www.w3.org/2005/Atom" href="'.$this->xml($feed).'" rel="self" type="application/rss+xml"/>'.$entries.'</channel></rss>';
    }

    private function atom(string $locale, array $items): string
    {
        $feed = $this->absolute(Locale::path('/atom.xml', $locale));
        $updated = $items[0]['date'] ?? now()->toImmutable();
        $entries = collect($items)->map(fn (array $item) => '<entry><id>'.$this->xml($item['url']).'</id><title>'.$this->xml($item['title']).'</title><link href="'.$this->xml($item['url']).'"/><updated>'.$item['date']?->setTimezone(new \DateTimeZone('UTC'))->format(DATE_ATOM).'</updated>'.(filled($item['summary']) ? '<summary>'.$this->xml($item['summary']).'</summary>' : '').'</entry>')->implode('');

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
        return $this->maintenance->handle(new IsPublicSiteInMaintenanceQuery);
    }
}
