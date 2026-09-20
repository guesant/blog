@props(['name', 'value' => '1', 'checked' => false, 'label'])
<label {{ $attributes->only('class')->merge(['class' => 'filter-label filter-checkbox']) }}>
    <input
        type="checkbox"
        name="{{ $name }}"
        value="{{ $value }}"
        @checked($checked)
        {{ $attributes->except('class') }}
    >
    {{ $label }}
</label>
