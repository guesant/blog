<style>
    body.portfolio-admin-login {
        --admin-login-background: #f4f5f2;
        --admin-login-grid: rgb(15 23 42 / 6%);
        --admin-login-surface: #ffffff;
        --admin-login-border: rgb(15 23 42 / 16%);
        --admin-login-text: #172033;
        --admin-login-muted: #5b6577;
        --admin-login-accent: #2457d6;
        --admin-login-accent-contrast: #ffffff;
        --admin-login-space: 2rem;
        --admin-login-mobile-space: 1rem;
        --admin-login-header-gap: 1rem;
        --admin-login-content-gap: 2rem;
        --admin-login-card-padding: 2.5rem;
        --admin-login-mobile-card-padding: 1.5rem;
        --admin-login-card-max-width: 30rem;
        --admin-login-card-border-width: 1px;
        --admin-login-card-accent-height: 0.25rem;
        --admin-login-grid-size: 2rem;
        --admin-login-grid-line-width: 1px;
        --admin-login-viewport-height: 100vh;
        --admin-login-shadow: 0.5rem 0.5rem 0 rgb(15 23 42 / 12%);
        --admin-login-logo-size: 0.875rem;
        --admin-login-heading-size: 2rem;
        --admin-login-subheading-size: 0.9375rem;
        --admin-login-button-padding-block: 0.875rem;
        --admin-login-button-padding-inline: 1rem;
        --admin-login-button-label-size: 0.6875rem;
        --admin-login-logo-spacing: 0.08em;
        --admin-login-heading-spacing: -0.03em;
        --admin-login-button-lift: 0.125rem;
        --admin-login-transition-duration: 120ms;

        background-color: var(--admin-login-background);
        background-image:
            linear-gradient(
                var(--admin-login-grid) var(--admin-login-grid-line-width),
                transparent var(--admin-login-grid-line-width)
            ),
            linear-gradient(
                90deg,
                var(--admin-login-grid) var(--admin-login-grid-line-width),
                transparent var(--admin-login-grid-line-width)
            );
        background-size: var(--admin-login-grid-size) var(--admin-login-grid-size);
        color: var(--admin-login-text);
    }

    html.dark body.portfolio-admin-login {
        --admin-login-background: #0d1016;
        --admin-login-grid: rgb(255 255 255 / 5%);
        --admin-login-surface: #171b23;
        --admin-login-border: rgb(255 255 255 / 17%);
        --admin-login-text: #f4f7fb;
        --admin-login-muted: #aab3c2;
        --admin-login-accent: #7da2ff;
        --admin-login-accent-contrast: #0d1016;
        --admin-login-shadow: 0.5rem 0.5rem 0 rgb(0 0 0 / 30%);
    }

    body.portfolio-admin-login .fi-simple-layout {
        min-height: var(--admin-login-viewport-height);
        padding: var(--admin-login-space);
    }

    body.portfolio-admin-login .fi-simple-main-ctn {
        width: 100%;
    }

    body.portfolio-admin-login .fi-simple-main {
        width: 100%;
        max-width: var(--admin-login-card-max-width);
    }

    body.portfolio-admin-login .fi-simple-page {
        position: relative;
        overflow: hidden;
        border: var(--admin-login-card-border-width) solid var(--admin-login-border);
        border-radius: 0;
        background: var(--admin-login-surface);
        box-shadow: var(--admin-login-shadow);
    }

    body.portfolio-admin-login .fi-simple-page::before {
        display: block;
        height: var(--admin-login-card-accent-height);
        background: var(--admin-login-accent);
        content: '';
    }

    body.portfolio-admin-login .fi-simple-page-content {
        padding: var(--admin-login-card-padding);
    }

    body.portfolio-admin-login .fi-simple-header {
        align-items: flex-start;
        gap: var(--admin-login-header-gap);
        text-align: left;
    }

    body.portfolio-admin-login .fi-simple-header::after {
        width: 2.5rem;
        height: 0.125rem;
        background: var(--admin-login-accent);
        content: '';
    }

    body.portfolio-admin-login .fi-logo {
        color: var(--admin-login-accent);
        font-family: var(--mono-font-family);
        font-size: var(--admin-login-logo-size);
        font-weight: 700;
        letter-spacing: var(--admin-login-logo-spacing);
        text-transform: uppercase;
    }

    body.portfolio-admin-login .fi-simple-header-heading {
        color: var(--admin-login-text);
        font-size: var(--admin-login-heading-size);
        font-weight: 700;
        letter-spacing: var(--admin-login-heading-spacing);
        line-height: 1.1;
    }

    body.portfolio-admin-login .fi-simple-header-subheading {
        width: 100%;
        margin-top: var(--admin-login-content-gap);
        color: var(--admin-login-muted);
        font-size: var(--admin-login-subheading-size);
        line-height: 1.5;
    }

    body.portfolio-admin-login .fi-simple-header-subheading a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: var(--admin-login-header-gap);
        padding: var(--admin-login-button-padding-block)
            var(--admin-login-button-padding-inline);
        border: var(--admin-login-card-border-width) solid var(--admin-login-accent);
        border-radius: 0;
        background: var(--admin-login-accent);
        color: var(--admin-login-accent-contrast);
        font-weight: 700;
        text-decoration: none;
        transition:
            filter var(--admin-login-transition-duration) ease,
            transform var(--admin-login-transition-duration) ease;
    }

    body.portfolio-admin-login .fi-simple-header-subheading a::after {
        content: 'OPEN';
        font-family: var(--mono-font-family);
        font-size: var(--admin-login-button-label-size);
        letter-spacing: var(--admin-login-logo-spacing);
        line-height: 1;
    }

    body.portfolio-admin-login .fi-simple-header-subheading a:hover {
        filter: brightness(1.08);
        transform: translateY(calc(var(--admin-login-button-lift) * -1));
    }

    @media (max-width: 640px) {
        body.portfolio-admin-login .fi-simple-layout {
            padding: var(--admin-login-mobile-space);
        }

        body.portfolio-admin-login .fi-simple-page-content {
            padding: var(--admin-login-mobile-card-padding);
        }
    }
</style>
