@props(['currentLocale', 'siteSettings' => null, 'emailChallenge' => null, 'copyright' => null, 'sourceRepositoryUrl' => null, 'commitSha' => null])
@php
    $navUrl = function (string $name) use ($currentLocale) {
        $routeName = \App\Content\Locale::routeName($name, $currentLocale);

        return \Illuminate\Support\Facades\Route::has($routeName)
            ? route($routeName)
            : \App\Content\Locale::url($name === 'home' ? '/' : "/{$name}", $currentLocale);
    };
@endphp
<footer class="site-footer">
    <div class="footer-grid">
        <x-site.footer-col :label="__('footer.sitemap_label')">
            @foreach((new \App\Content\NavQuery)->siteMapTree($currentLocale) as $item)
                <a href="{{ $navUrl($item['route']) }}">{{ $item['label'] }}</a>
                @foreach($item['children'] ?? [] as $child)
                    <a class="footer-sub" href="{{ $navUrl($child['route']) }}">{{ $child['label'] }}</a>
                @endforeach
            @endforeach
        </x-site.footer-col>
        <x-site.footer-col :label="__('footer.legal_label')">
            <a href="{{ \App\Content\Locale::url('/license', $currentLocale) }}">{{ __('footer.license') }}</a>
            <a href="{{ \App\Content\Locale::url('/credits', $currentLocale) }}">{{ __('footer.credits') }}</a>
            <a href="{{ \App\Content\Locale::url('/contact', $currentLocale) }}">{{ __('footer.issue_report') }}</a>
        </x-site.footer-col>
        <x-site.footer-col :label="__('footer.connect_label')">
            <x-site.contact-channels :contact-profiles="$siteSettings?->contactProfiles ?? collect()" :email-challenge="$emailChallenge" />
        </x-site.footer-col>
    </div>

    <div class="footer-bottom">
        <p>{{ $copyright }}</p>
        @if ($commitSha)
            <p class="build-stamp"><a href="{{ $sourceRepositoryUrl }}/-/commit/{{ $commitSha }}" target="_blank" rel="noopener">build {{ substr($commitSha, 0, 7) }}<x-site.icon name="arrow-up-right" :size="12" class="external-icon" /></a></p>
        @else
            <p class="build-stamp">build: dev</p>
        @endif
    </div>
</footer>
