@props([
    'title' => '',
    'description' => null,
    'robots' => null,
    'ogType' => 'website',
    'publishedTime' => null,
    'structuredData' => null,
    'baseRouteName' => null,
    'routeParams' => [],
    'chromeless' => false,
    'chrome' => [],
    'siteSettings' => null,
    'headerProfile' => null,
    'currentLocale' => null,
    'emailChallenge' => null,
    'copyright' => null,
    'sourceRepositoryUrl' => null,
    'commitSha' => null,
])

@php
    $siteSettings ??= $chrome['siteSettings'] ?? null;
    $headerProfile ??= $chrome['headerProfile'] ?? null;
    $currentLocale ??= $chrome['currentLocale'] ?? null;
    $emailChallenge ??= $chrome['emailChallenge'] ?? null;
    $copyright ??= $chrome['copyright'] ?? null;
    $sourceRepositoryUrl ??= $chrome['sourceRepositoryUrl'] ?? null;
    $commitSha ??= $chrome['commitSha'] ?? null;

    $currentLocale ??= app()->getLocale();
    $baseRouteName ??= request()->route() ? \App\Content\Locale::baseRouteName(request()->route()->getName()) : 'home';
    $routeParams = $routeParams ?: request()->route()?->parameters() ?? [];

    $profileT = $headerProfile?->translation($currentLocale);
    $siteSeo = $siteSettings?->translation($currentLocale)?->seo ?? [];
    $siteName = 'guesant.net';
    $defaultTitle = trim($siteSeo['title'] ?? '') !== '' ? $siteSeo['title'] : $siteName;
    $defaultDescription =
        trim($siteSeo['description'] ?? '') !== '' ? $siteSeo['description'] : $profileT?->description ?? '';
    $metaKeywords = collect($siteSeo['keywords'] ?? [])
        ->filter()
        ->values();
    $ogLocale = $currentLocale === 'pt-BR' ? 'pt_BR' : 'en_US';
    $ogAlternateLocale = $currentLocale === 'pt-BR' ? 'en_US' : 'pt_BR';

    $viteEntries = [
        'resources/css/home-fonts.css',
        'resources/css/home.css',
        'resources/js/home-email-reveal.js',
        'resources/js/home.js',
        'resources/js/nav-drawer.js',
    ];
    $themeColor = '#ffffff';

    $pageTitle = trim($title);
    $fullTitle = $pageTitle !== '' && $pageTitle !== $defaultTitle ? $pageTitle . ' · ' . $siteName : $defaultTitle;
    $pageDescription = trim($description ?? '') ?: $defaultDescription;
    $robotsContent = $siteSettings?->maintenance_enabled
        ? 'noindex, nofollow'
        : (trim($robots ?? '') ?:
        'index, follow');

    $ogTitle = $pageTitle !== '' ? $pageTitle : $defaultTitle;
    $ogImageUrl = filled($siteSeo['image'] ?? null) ? $siteSeo['image'] : null;
    $ogImageAlt = $siteSeo['imageAlt'] ?? $ogTitle;
@endphp
<!doctype html>
<html lang="{{ $currentLocale }}">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>{{ $fullTitle }}</title>
    <meta
        name="description"
        content="{{ $pageDescription }}"
    >
    @if ($metaKeywords->isNotEmpty())
        <meta
            name="keywords"
            content="{{ $metaKeywords->implode(', ') }}"
        >
    @endif
    <meta
        name="author"
        content="{{ $headerProfile?->name }}"
    >
    <meta
        name="application-name"
        content="{{ $siteName }}"
    >
    <meta
        name="format-detection"
        content="telephone=no, email=no, address=no"
    >
    <meta
        name="category"
        content="technology"
    >
    <meta
        name="referrer"
        content="origin-when-cross-origin"
    >
    <meta
        name="robots"
        content="{{ $robotsContent }}"
    >
    <meta
        name="theme-color"
        content="{{ $themeColor }}"
    >
    <meta
        name="color-scheme"
        content="light"
    >
    @if (config('services.google.site_verification'))
        <meta
            name="google-site-verification"
            content="{{ config('services.google.site_verification') }}"
        >
    @endif
    <link
        rel="icon"
        href="/icon.svg"
        type="image/svg+xml"
    >
    <link
        rel="manifest"
        href="/manifest.webmanifest"
    >
    <link
        rel="canonical"
        href="{{ \App\Content\Seo::canonicalUrl() }}"
    >
    @foreach (\App\Content\Seo::alternateUrls() as $hreflang => $url)
        <link rel="alternate" hreflang="{{ $hreflang }}" href="{{ $url }}">
    @endforeach
    <meta
        property="og:title"
        content="{{ $ogTitle }}"
    >
    <meta
        property="og:description"
        content="{{ $pageDescription }}"
    >
    <meta
        property="og:type"
        content="{{ $ogType }}"
    >
    <meta
        property="og:url"
        content="{{ \App\Content\Seo::canonicalUrl() }}"
    >
    <meta
        property="og:site_name"
        content="{{ $siteName }}"
    >
    <meta
        property="og:locale"
        content="{{ $ogLocale }}"
    >
    <meta
        property="og:locale:alternate"
        content="{{ $ogAlternateLocale }}"
    >
    @if ($ogImageUrl)
        <meta
            property="og:image"
            content="{{ $ogImageUrl }}"
        >
        <meta
            property="og:image:width"
            content="1200"
        >
        <meta
            property="og:image:height"
            content="630"
        >
        <meta
            property="og:image:alt"
            content="{{ $ogImageAlt }}"
        >
    @endif
    @if ($publishedTime)
        <meta
            property="article:published_time"
            content="{{ $publishedTime }}"
        >
        <meta
            property="article:author"
            content="{{ \App\Content\Locale::url('/about', $currentLocale) }}"
        >
    @endif
    <meta
        name="twitter:card"
        content="{{ $ogImageUrl ? 'summary_large_image' : 'summary' }}"
    >
    <meta
        name="twitter:title"
        content="{{ $ogTitle }}"
    >
    <meta
        name="twitter:description"
        content="{{ $pageDescription }}"
    >
    @if ($ogImageUrl)
        <meta
            name="twitter:image"
            content="{{ $ogImageUrl }}"
        >
    @endif
    @if ($structuredData)
        <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
    @endif
    @if (! app()->environment('testing'))
        @vite($viteEntries)
    @endif
</head>

<body>
    <a
        href="#main-content"
        class="skip-link"
    >{{ __('nav.skip_to_content') }}</a>
    @if ($chromeless)
        <div class="page page--chromeless">
            <main
                id="main-content"
                tabindex="-1"
            >
                {{ $slot }}
            </main>
        </div>
    @else
        <div class="page">
            <x-site.nav
                :current-locale="$currentLocale"
                :base-route-name="$baseRouteName"
                :route-params="$routeParams"
            />
            <div class="page-body">
                <main
                    id="main-content"
                    tabindex="-1"
                >
                    {{ $slot }}
                </main>
                <x-site.footer
                    :current-locale="$currentLocale"
                    :site-settings="$siteSettings"
                    :email-challenge="$emailChallenge"
                    :copyright="$copyright"
                    :source-repository-url="$sourceRepositoryUrl"
                    :commit-sha="$commitSha"
                />
            </div>
        </div>
        <x-site.analytics-consent />
    @endif
</body>

</html>
