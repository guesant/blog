@props(['content', 'markdown' => true])

@if (trim($content ?? '') !== '')
    @if ($markdown)
        <div {{ $attributes->merge(['class' => 'rich-text']) }}>{!! \Illuminate\Support\Str::markdown($content ?? '', ['html_input' => 'strip', 'allow_unsafe_links' => false]) !!}</div>
    @else
        <div {{ $attributes->merge(['class' => 'rich-text']) }}>{!! $content !!}</div>
    @endif
@endif
