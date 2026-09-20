@props(['message', 'cat' => false, 'eyes' => '^.^'])

<div class="index-empty">
    @if ($cat)
        <x-site.ascii-cat :eyes="$eyes" />
    @endif
    <p class="section-label">{{ $message }}</p>
</div>
