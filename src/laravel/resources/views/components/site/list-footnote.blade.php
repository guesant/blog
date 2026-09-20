@props(['actionHref' => null, 'actionLabel' => null, 'cat' => false, 'eyes' => '^.^'])
<div class="list-footnote">
    @if ($cat)
        <x-site.ascii-cat :eyes="$eyes" />
    @endif
    <p>{{ $slot }}</p>
    @if ($actionHref)
        <a href="{{ $actionHref }}">{{ $actionLabel }}</a>
    @endif
</div>
