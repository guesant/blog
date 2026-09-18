@php
    $currentLocale = app()->getLocale();
    $siteSettings = $chrome['siteSettings'] ?? null;
    $headerProfile = $chrome['headerProfile'] ?? null;
    $t = $siteSettings?->translation($currentLocale);
@endphp
<x-site.document
    :title="$t?->maintenance_title"
    :description="$t?->maintenance_description"
    robots="noindex, nofollow"
    :chrome="$chrome"
    :chromeless="true"
>
    <x-site.maintenance-hero
        :label="$t?->maintenance_eyebrow"
        :title="$t?->maintenance_title"
        :description="$t?->maintenance_description"
        :signature="$headerProfile?->name"
    />
</x-site.document>
