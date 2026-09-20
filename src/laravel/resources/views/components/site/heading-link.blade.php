@props(['title', 'href' => null, 'external' => false])
@if ($href)
    <a
        href="{{ $href }}"
        @if ($external) target="_blank" rel="noopener" @endif
    >{{ $title }}@if ($external)
            <x-site.icon
                name="arrow-up-right"
                :size="12"
                class="external-icon"
            />
        @endif
    </a>
    @else{{ $title }}
@endif
