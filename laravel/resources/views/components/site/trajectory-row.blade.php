@props(['period' => null, 'title' => null, 'titleHref' => null, 'external' => false, 'subtitle' => null])
<div class="trajectory-row">
    <p class="period">{{ $period }}</p>
    <div>
        @if (filled($title))
            <h3>
                <x-site.heading-link
                    :title="$title"
                    :href="$titleHref"
                    :external="$external"
                />
            </h3>
        @endif
        @if (filled($subtitle))
            <p class="org">{{ $subtitle }}</p>
        @endif
        {{ $slot }}
    </div>
</div>
