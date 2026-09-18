@props(['items', 'variant' => null, 'label' => null])
@php $isList = $variant === 'list'; @endphp
@if ($label)
    <p class="section-label">{{ $label }}</p>
@endif
<{{ $isList ? 'ul' : 'div' }} class="{{ $isList ? 'bordered-list' : 'tech-tags' }}">
    @foreach ($items as $item)
        @php $item = is_array($item) ? $item : ['label' => $item]; @endphp
        @if ($isList)
            <li>
        @endif
        @if ($item['href'] ?? null)
            <a
                href="{{ $item['href'] }}"
                @if ($item['external'] ?? false) target="_blank" rel="noopener" @endif
                @if ($item['title'] ?? null) title="{{ $item['title'] }}" @endif
            >
                @if ($item['icon'] ?? null)
                    <x-site.icon :name="$item['icon']" />
                @endif
                {{ $item['label'] }}
                @if ($item['external'] ?? false)
                    <x-site.icon
                        name="arrow-up-right"
                        :size="12"
                        class="external-icon"
                    />
                @endif
            </a>
        @else
            <span>{{ $item['label'] }}</span>
        @endif
        @if ($isList)
            </li>
        @endif
    @endforeach
    </{{ $isList ? 'ul' : 'div' }}>
