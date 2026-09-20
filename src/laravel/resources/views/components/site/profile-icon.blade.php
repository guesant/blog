@props(['platform', 'size' => 16])

@php
    $brands = ['bluesky', 'github', 'gitlab', 'instagram', 'mastodon', 'orcid', 'researchgate'];
    $brand = $platform === 'scholar' ? 'googlescholar' : (in_array($platform, $brands, true) ? $platform : null);
    $glyphs = ['lattes' => 'graduation-cap', 'linkedin' => 'briefcase'];
@endphp

@if ($brand)
    <x-site.brand-icon
        :name="$brand"
        :size="$size"
    />
@else
    <x-site.icon
        :name="$glyphs[$platform] ?? 'external-link'"
        :size="$size"
    />
@endif
