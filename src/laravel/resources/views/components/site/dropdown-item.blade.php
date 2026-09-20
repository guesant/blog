@props(['type' => 'button'])
<button
    type="{{ $type }}"
    role="menuitem"
    data-dropdown-item
    {{ $attributes->merge(['class' => 'dropdown-item']) }}
>{{ $slot }}</button>
