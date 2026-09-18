@props(['trail' => [], 'currentLocale' => null])
@php
    $currentLocale = $currentLocale ?? app()->getLocale();
@endphp
<div class="breadcrumb-bar">
    <nav
        class="breadcrumb"
        aria-label="{{ __('nav.breadcrumb') }}"
    >
        @if (empty($trail))
            <span aria-current="page">
                <x-site.icon
                    name="home"
                    :size="12"
                    class="breadcrumb-home-icon"
                />
                {{ __('nav.home') }}
            </span>
        @else
            <a href="{{ \App\Content\Locale::url('/', $currentLocale) }}">
                <x-site.icon
                    name="home"
                    :size="12"
                    class="breadcrumb-home-icon"
                />
                {{ __('nav.home') }}
            </a>
            @foreach ($trail as $item)
                <span aria-hidden="true"> / </span>
                @if ($item['href'] ?? null)
                    <a href="{{ $item['href'] }}">{{ $item['label'] }}</a>
                @else
                    <span aria-current="page">{{ $item['label'] }}</span>
                @endif
            @endforeach
        @endif
    </nav>
</div>
