@props(['label'])
<div class="footer-col">
    <p class="section-label">{{ $label }}</p>
    {{ $slot }}
</div>
