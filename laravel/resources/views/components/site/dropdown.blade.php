@props(['align' => 'start'])
<div
    class="dropdown"
    data-dropdown
>
    <button
        type="button"
        class="view-toggle-btn dropdown-trigger"
        data-dropdown-trigger
        aria-haspopup="menu"
        aria-expanded="false"
    >
        {{ $trigger }}
        <x-site.icon
            name="chevron-down"
            :size="12"
            class="dropdown-caret"
        />
    </button>
    <div
        class="dropdown-menu"
        data-dropdown-menu
        data-align="{{ $align }}"
        role="menu"
        hidden
    >
        {{ $slot }}
    </div>
</div>
