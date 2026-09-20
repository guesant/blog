@props(['currentLocale', 'baseRouteName', 'routeParams' => []])
@php
    $langUrl = function (string $routeName, string $locale) use ($baseRouteName, $routeParams) {
        return \Illuminate\Support\Facades\Route::has($routeName)
            ? route($routeName, $routeParams)
            : \App\Content\Locale::url($baseRouteName === 'home' ? '/' : "/{$baseRouteName}", $locale);
    };
@endphp
<div class="lang-switch">
    <a
        href="{{ $langUrl($baseRouteName, 'en') }}"
        class="nav-pill"
        @if ($currentLocale === 'en') aria-current="true" @endif
    >en</a>
    <a
        href="{{ $langUrl(\App\Content\Locale::routeName($baseRouteName, 'pt-BR'), 'pt-BR') }}"
        class="nav-pill"
        @if ($currentLocale === 'pt-BR') aria-current="true" @endif
    >pt</a>
</div>
