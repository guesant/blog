@props(['variant' => 'body'])
@php
    $class = match ($variant) {
        'excerpt' => 'excerpt',
        'label' => 'section-label',
        'meta' => 'meta',
        'topics' => 'topics',
        'org' => 'org',
        'period' => 'period',
        'filter-label' => 'filter-label',
        default => 'text',
    };
@endphp
<p {{ $attributes->merge(['class' => $class]) }}>{{ $slot }}</p>
