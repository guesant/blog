@props(['slug'])

@php
    static $icons = null;
    $icons ??= include resource_path('php/tech-icons.php');
    $icon = $slug ? $icons[$slug] ?? null : null;
@endphp

@if ($icon)
    <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="#{{ $icon['hex'] }}"
        role="img"
        aria-hidden="true"
        {{ $attributes->merge(['class' => 'icon']) }}
    >
        <path d="{{ $icon['path'] }}" />
    </svg>
@endif
