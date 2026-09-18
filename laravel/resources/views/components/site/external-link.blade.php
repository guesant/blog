@props(['href'])

<a
    href="{{ $href }}"
    target="_blank"
    rel="noopener noreferrer"
    {{ $attributes }}
>{{ $slot }}<x-site.icon
        name="arrow-up-right"
        :size="12"
        class="external-icon"
    /></a>
