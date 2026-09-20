@props(['name', 'size' => 16, 'set' => 'lucide'])
@php
    static $uiIcons = null;
    static $phosphorIcons = null;
    $uiIcons ??= include resource_path('php/ui-icons.php');
    $phosphorIcons ??= include resource_path('php/phosphor-icons.php');
    $icons = $set === 'phosphor' ? $phosphorIcons : $uiIcons;
    $viewBox = $set === 'phosphor' ? '0 0 256 256' : '0 0 24 24';
@endphp
@if (isset($icons[$name]))
    @if ($set === 'phosphor')
        <svg
            {{ $attributes->merge(['class' => 'icon']) }}
            viewBox="{{ $viewBox }}"
            width="{{ $size }}"
            height="{{ $size }}"
            fill="currentColor"
            aria-hidden="true"
        >{!! $icons[$name] !!}</svg>
    @else
        <svg
            {{ $attributes->merge(['class' => 'icon']) }}
            viewBox="{{ $viewBox }}"
            width="{{ $size }}"
            height="{{ $size }}"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >{!! $icons[$name] !!}</svg>
    @endif
@endif
