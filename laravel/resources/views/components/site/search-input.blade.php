@props(['name' => 'q', 'value' => null, 'placeholder' => null, 'label' => null])

<div {{ $attributes->only('class')->merge(['class' => 'kind-filter']) }}>
    @if ($label)
        <label
            class="filter-label"
            for="{{ $attributes->get('id') }}"
        >{{ $label }}</label>
    @endif
    <div class="feed-search-wrap">
        <x-site.icon
            name="search"
            :size="14"
        />
        <input
            type="search"
            name="{{ $name }}"
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
            {{ $attributes->except('class')->merge(['class' => 'feed-search']) }}
        >
    </div>
</div>
