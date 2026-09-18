@props(['variant' => 'list'])
<div {{ $attributes->merge(['class' => $variant === 'index' ? 'index-list' : 'list']) }}>
    {{ $slot }}
</div>
