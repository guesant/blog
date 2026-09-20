@props(['code', 'title', 'description'])

@php
    $catEyes = match (true) {
        (int) $code === 404 => '?.?',
        (int) $code >= 500 => 'x.x',
        default => '-.-',
    };

    $currentLocale = app()->getLocale();
    $chrome = (new \App\Content\SiteChromeQuery())->build($currentLocale);
@endphp
<x-site.document
    :title="$title"
    :description="$description"
    robots="noindex, nofollow"
    :chrome="$chrome"
    base-route-name="home"
>
    <x-site.breadcrumb
        :trail="[['label' => __('errors.error_prefix') . ' ' . $code]]"
        :current-locale="$currentLocale"
    />
    <x-site.hero
        :trail="[['label' => __('errors.error_prefix') . ' ' . $code]]"
        :current-locale="$currentLocale"
        :eyebrow="__('errors.error_prefix') . ' ' . $code"
        :title="$title"
        :lead="$description"
    />
    <x-site.empty-state
        message=""
        :cat="true"
        :eyes="$catEyes"
    />
    <x-site.hero-actions :items="[
        ['href' => \App\Content\Locale::url('/', $currentLocale), 'label' => __('errors.back_home')],
    ]" />
</x-site.document>
