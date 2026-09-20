@props(['eyebrow' => null, 'title', 'lead' => null, 'trail' => [], 'currentLocale' => null])
@php
    $currentLocale = $currentLocale ?? app()->getLocale();
    $backTarget = collect($trail)->reverse()->first(fn($item) => filled($item['href'] ?? null));
    $backHref = empty($trail)
        ? null
        : $backTarget['href'] ?? \App\Content\Locale::url('/', $currentLocale);
    $backLabel = $backTarget['label'] ?? __('nav.home');
@endphp

<div class="hero">
    <div class="hero-title-row">
        @if ($backHref)
            <a
                href="{{ $backHref }}"
                class="back-link back-link--hero"
                aria-label="{{ __('nav.back') }}: {{ $backLabel }}"
            >
                <x-site.icon
                    name="arrow-left"
                    :size="14"
                />
            </a>
        @endif
        <h1>{{ $title }}</h1>
    </div>
    @if ($lead !== null)
        <p>{{ $lead }}</p>
    @endif
    {{ $slot }}
</div>
