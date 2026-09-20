@props(['name', 'size' => 16])
@php
    static $brandIcons = null;
    $brandIcons ??= include resource_path('php/brand-icons.php');
@endphp
@if (isset($brandIcons[$name]))
    <svg
        {{ $attributes->merge(['class' => 'icon']) }}
        viewBox="0 0 24 24"
        width="{{ $size }}"
        height="{{ $size }}"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="{{ $brandIcons[$name]['path'] }}" />
    </svg>
@endif
