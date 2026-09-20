@props(['name', 'label' => null, 'icon' => null])
<span {{ $attributes->only('class')->merge(['class' => 'kind-filter']) }}>
    @if ($label)
        <label
            class="filter-label"
            for="{{ $attributes->get('id') }}"
        >{{ $label }}</label>
    @endif
    <span @class(['select-wrap', 'has-icon' => $icon])>
        @if ($icon)
            <x-site.icon
                :name="$icon"
                :size="14"
                class="select-icon"
            />
        @endif
        <select
            name="{{ $name }}"
            {{ $attributes->except('class')->merge(['class' => 'topic-filter']) }}
        >{{ $slot }}</select>
    </span>
</span>
