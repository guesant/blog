@props(['label' => null, 'title', 'description', 'signature' => null])
<div class="maintenance-hero">
    @if ($label)
        <p class="section-label">{{ $label }}</p>
    @endif
    <h1>{{ $title }}</h1>
    <p>{{ $description }}</p>
    <x-site.ascii-cat eyes="-.-" />
    @if ($signature)
        <p class="maintenance-signature">{{ $signature }}</p>
    @endif
</div>
