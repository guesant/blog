@props(['items'])
<div {{ $attributes->merge(['class' => 'hero-actions action-grid']) }}>
    @foreach ($items as $item)
        <a
            href="{{ $item['href'] }}"
            @if ($item['external'] ?? false) target="_blank" rel="noopener" @endif
        >{{ $item['label'] }}@if ($item['external'] ?? false)
                <x-site.icon
                    name="arrow-up-right"
                    :size="12"
                    class="external-icon"
                />
            @endif
        </a>
    @endforeach
</div>
