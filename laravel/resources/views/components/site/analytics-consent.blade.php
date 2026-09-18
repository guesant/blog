@php
    $gtmId = config('services.google.tag_manager_id');
    $gaId = config('services.google.analytics_id');
@endphp
@if ($gtmId || $gaId)
    <div
        class="analytics-consent"
        data-analytics-consent
        data-gtm-id="{{ $gtmId }}"
        data-ga-id="{{ $gaId }}"
        role="dialog"
        aria-labelledby="analytics-consent-title"
        hidden
    >
        <p
            id="analytics-consent-title"
            class="analytics-consent-text"
        >{{ __('analytics.title') }}</p>
        <p class="analytics-consent-text">{{ __('analytics.description') }}</p>
        <div class="analytics-consent-actions">
            <button
                type="button"
                data-analytics-decline
            >{{ __('analytics.decline') }}</button>
            <button
                type="button"
                data-analytics-accept
            >{{ __('analytics.accept') }}</button>
        </div>
    </div>
@endif
