@props(['items'])
<ul class="link-list">
    @foreach ($items as $item)
        <li>
            @if ($item['href'] ?? null)
                <a href="{{ $item['href'] }}">{{ $item['label'] }}</a>@else{{ $item['label'] }}
            @endif
        </li>
    @endforeach
</ul>
