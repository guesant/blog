@props(['href' => null, 'type' => 'submit', 'icon' => null])
@if ($href)
    <a
        href="{{ $href }}"
        {{ $attributes->merge(['class' => 'view-toggle-btn']) }}
    >
        @if ($icon)
            <x-site.icon
                :name="$icon"
                :size="14"
            />
        @endif
        {{ $slot }}
    </a>
@else
    <button
        type="{{ $type }}"
        {{ $attributes->merge(['class' => 'view-toggle-btn']) }}
    >
        @if ($icon)
            <x-site.icon
                :name="$icon"
                :size="14"
            />
        @endif
        {{ $slot }}
    </button>
@endif
