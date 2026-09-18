@props(['href', 'label', 'route' => null, 'active' => false, 'activeParent' => false])
@php
    $navIcon = $route ? \App\Support\NavIcon::for($route) : null;
@endphp
<a
    href="{{ $href }}"
    @class(['nav-pill', 'is-active-parent' => $activeParent])
    @if ($active) aria-current="page" @endif
>@if ($active)
        <x-site.icon
            name="arrow-right"
            :size="12"
            class="active-indicator"
        />
    @endif
    @if ($navIcon)
        <x-site.icon
            :name="$navIcon['name']"
            :set="$navIcon['set']"
            :size="14"
            class="nav-item-icon"
        />
    @endif
    <span class="nav-item-label">{{ $label }}</span>
</a>