@props(['facts'])

@php
    $fallbackIcons = [
        __('cards.context') => 'map-pin',
        __('cards.role') => 'user',
        __('cards.outcome') => 'flag',
        __('pages.projects_problem') => 'target',
        __('pages.projects_current_focus') => 'compass',
        __('findings.cycle_found') => 'calendar',
        __('findings.cycle_state') => 'clock',
    ];
@endphp
<div class="case-facts">
    @foreach ($facts as $key => $item)
        @php
            $isStructured = is_array($item) && array_key_exists('value', $item);
            $label = $isStructured ? ($item['label'] ?? $key) : $key;
            $value = $isStructured ? $item['value'] : $item;
            $icon = $isStructured ? $item['icon'] ?? null : $fallbackIcons[$label] ?? null;
        @endphp
        @continue($value === null || $value === '')
        <div class="case-facts-row">
            <span
                class="case-facts-icon"
                aria-hidden="true"
            >
                @if ($icon)
                    <x-site.icon
                        :name="$icon"
                        set="phosphor"
                        :size="20"
                    />
                @endif
            </span>
            <div>
                <dl>
                    <div>
                        <dt>{{ $label }}</dt>
                        <dd>{{ $value }}</dd>
                    </div>
                </dl>
            </div>
        </div>
    @endforeach
</div>
