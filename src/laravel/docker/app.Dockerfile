FROM laravelsail/php83-composer@sha256:428fa9b2edf2cfc1be71a6c32f0d6723449e5edc6ae1c3eeaac5a31d89b0c9f2

# Filament requires ext-intl, which the base image doesn't ship with.
# GD (+ freetype) renders the dynamic OG image; fonts-liberation ships
# Liberation Sans, metrically compatible with Arial — the same fallback the
# legacy /og route used ('Arial, sans-serif'), so no font-conversion needed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev libpq-dev libzip-dev fonts-liberation \
    && apt-get upgrade -y \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install intl gd pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN echo "expose_php = Off" > /usr/local/etc/php/conf.d/no-expose-php.ini

RUN rm -rf /laravel-installer /root/.composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist

# Résumé PDF generation (Fase 10): static Tectonic binary, no LaTeX distro install.
# The installer script only targets aarch64-unknown-linux-gnu on arm64, which
# tectonic doesn't publish; the musl build is a self-contained static binary
# that runs fine on this glibc-based image, so fetch it directly instead.
ARG TECTONIC_SHA256_X86_64=8533d07f9ccbd7a65824b9e0459041bca34af1eb33daba48f59215593753a3b7
ARG TECTONIC_SHA256_AARCH64=b10954a95404f3ab2328d2fa59a5ebab8e657f893fab096f98be8db7c0c979b8
RUN ARCH="$(uname -m)" \
    && case "$ARCH" in \
        x86_64) TECTONIC_TARGET="x86_64-unknown-linux-musl"; TECTONIC_SHA256="$TECTONIC_SHA256_X86_64" ;; \
        aarch64) TECTONIC_TARGET="aarch64-unknown-linux-musl"; TECTONIC_SHA256="$TECTONIC_SHA256_AARCH64" ;; \
        *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;; \
    esac \
    && curl --proto '=https' -fsSL \
        "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-${TECTONIC_TARGET}.tar.gz" \
        -o /tmp/tectonic.tar.gz \
    && printf '%s  %s\n' "$TECTONIC_SHA256" /tmp/tectonic.tar.gz > /tmp/tectonic.sha256 \
    && sha256sum -c /tmp/tectonic.sha256 \
    && tar -xzf /tmp/tectonic.tar.gz -C /usr/local/bin \
    && rm -f /tmp/tectonic.tar.gz /tmp/tectonic.sha256
