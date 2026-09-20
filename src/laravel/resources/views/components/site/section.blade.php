@props([
    'id' => null,
    'label' => null,
    'title' => null,
    'description' => null,
    'actionHref' => null,
    'actionLabel' => null,
])
<section
    @if ($id) id="{{ $id }}" @endif
    {{ $attributes->merge(['class' => 'section']) }}
>
    @if (filled($label))
        <p class="section-label">{{ $label }}</p>
    @endif
    @if (filled($title))
        <h2 class="section-title">{{ $title }}</h2>
    @endif
    @if (filled($description))
        <p class="section-description">{{ $description }}</p>
    @endif
    @if ($actionHref)
        <a
            class="section-action"
            href="{{ $actionHref }}"
        >{{ $actionLabel }}</a>
    @endif
    {{ $slot }}
</section>
