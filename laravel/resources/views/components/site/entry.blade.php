@props([
    'title',
    'href' => null,
    'variant' => 'row',
    'headingLevel' => null,
    'external' => false,
    'kind' => null,
    'kindCategory' => null,
    'kindType' => null,
    'metaHasDate' => false,
    'icon' => null,
    'iconSet' => 'lucide',
])

@php
    $level = $headingLevel ?? ($variant === 'card' ? 'h3' : 'h2');
    $wrapperClass = $variant === 'card' ? 'case-entry' : 'entry';
    $metaClass = $variant === 'card' ? 'section-label' : 'meta';
    $kindIcon = $icon !== null ? ['name' => $icon, 'set' => $iconSet] : \App\Support\EntryKindIcon::for($kindCategory, $kindType);
@endphp
<div {{ $attributes->merge(['class' => $wrapperClass]) }}>
    @if ($kind)
        <span class="kind">
            @if ($kindIcon)
                <x-site.icon
                    :name="$kindIcon['name']"
                    :set="$kindIcon['set']"
                    :size="14"
                />
            @endif
            {{ $kind }}
        </span>
    @endif
    @isset($meta)
        <p class="{{ $metaClass }}">
            @if ($metaHasDate)
                <x-site.icon
                    name="clock"
                    set="phosphor"
                    :size="16"
                    class="meta-icon"
                />
            @endif
            {{ $meta }}
        </p>
    @endisset
    <{{ $level }}>
        <x-site.heading-link
            :title="$title"
            :href="$href"
            :external="$external"
        />
    </{{ $level }}>

    {{ $slot }}
</div>
