@props(['contactProfiles' => null, 'emailChallenge' => null, 'variant' => null])
@php
    $contactProfiles = $contactProfiles ?? collect();
    $brandPlatforms = ['bluesky', 'github', 'gitlab', 'instagram', 'mastodon', 'orcid', 'researchgate'];
    $isList = $variant === 'list';
    $isGrid = $variant === 'grid';
@endphp
@if ($isList)
    <ul class="bordered-list">
@endif
@if ($isGrid)
    <div class="action-grid-wrap">
@endif
@foreach ($contactProfiles as $profile)
    @php
        $profileBrand =
            $profile->platform === 'scholar'
                ? 'googlescholar'
                : (in_array($profile->platform, $brandPlatforms, true)
                    ? $profile->platform
                    : null);
    @endphp
    @if ($isList)
        <li>
    @endif
    <a
        href="{{ $profile->url }}"
        target="_blank"
        rel="me noopener"
    >
        @if ($profileBrand)
            <x-site.brand-icon :name="$profileBrand" />
        @elseif ($profile->platform === 'linkedin')
            <x-site.icon name="briefcase" />
        @elseif ($profile->platform === 'lattes')
            <x-site.icon name="graduation-cap" />
        @else
            <x-site.icon name="external-link" />
        @endif
        {{ $profile->label ?: $profile->platform }}
        <x-site.icon
            name="arrow-up-right"
            :size="12"
            class="external-icon"
        />
    </a>
    @if ($isList)
        </li>
    @endif
@endforeach
@if ($emailChallenge)
    @if ($isList)
        <li>
    @endif
    <div
        class="email-reveal"
        data-protected-email="{{ json_encode($emailChallenge) }}"
    >
        <button
            type="button"
            class="email-reveal-trigger"
            data-protected-email-trigger
        >
            <x-site.icon name="mail" />{{ __('footer.email') }}
        </button>
        <a
            href="#"
            class="email-reveal-trigger email-reveal-revealed"
            data-protected-email-revealed
            data-protected-email-state="revealed"
            hidden
        >
            <x-site.icon name="mail" /><span data-protected-email-revealed-text></span>
        </a>
        <div
            class="email-reveal-status"
            data-protected-email-state="working"
            hidden
            aria-live="polite"
        >
            <span
                class="email-spinner"
                aria-hidden="true"
            ></span>
            <span>{{ __('contact.reveal_working') }}</span>
        </div>
        <div
            class="email-reveal-status"
            data-protected-email-state="error"
            hidden
            aria-live="polite"
        >
            <span class="email-error-text">{{ __('contact.reveal_error') }}</span>
            <button
                type="button"
                class="email-reveal-retry"
                data-protected-email-retry
            >{{ __('contact.reveal_email') }}</button>
        </div>
        <noscript>
            <p class="email-noscript">{{ __('contact.reveal_noscript') }}</p>
        </noscript>
    </div>
    @if ($isList)
        </li>
    @endif
@endif
@if ($isList)
    </ul>
@endif
@if ($isGrid)
    </div>
@endif
