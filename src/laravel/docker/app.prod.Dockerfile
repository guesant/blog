FROM laravelsail/php83-composer@sha256:428fa9b2edf2cfc1be71a6c32f0d6723449e5edc6ae1c3eeaac5a31d89b0c9f2 AS composer

FROM dunglas/frankenphp:1.12.7-php8.3-bookworm@sha256:08ab9f028c9e6123cbeaa2c01df08b6d1ab18113dd8713b8b9d339d704618a7d AS php-base

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN cp /usr/local/bin/frankenphp /tmp/frankenphp \
    && rm /usr/local/bin/frankenphp \
    && mv /tmp/frankenphp /usr/local/bin/frankenphp

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev libpq-dev libzip-dev fonts-liberation \
    && install-php-extensions intl gd pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN echo "expose_php = Off" > /usr/local/etc/php/conf.d/no-expose-php.ini

FROM php-base AS composer-deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

FROM php-base
WORKDIR /app

RUN rm -rf /root/.composer

# Résumé PDF generation: static Tectonic binary, no LaTeX distro install.
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
    && curl --proto '=https' -fsSL --retry 5 --retry-all-errors --retry-delay 5 \
        "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-${TECTONIC_TARGET}.tar.gz" \
        -o /tmp/tectonic.tar.gz \
    && printf '%s  %s\n' "$TECTONIC_SHA256" /tmp/tectonic.tar.gz > /tmp/tectonic.sha256 \
    && sha256sum -c /tmp/tectonic.sha256 \
    && tar -xzf /tmp/tectonic.tar.gz -C /usr/local/bin \
    && rm -f /tmp/tectonic.tar.gz /tmp/tectonic.sha256

COPY . .
COPY --from=composer-deps /app/vendor ./vendor
RUN composer dump-autoload --optimize --no-dev \
    && rm -f public/hot public/storage \
    && mkdir -p database \
    && ln -s ../storage/app/public public/storage \
    && chown -R www-data:www-data storage bootstrap/cache database

COPY docker/entrypoint.prod.sh /usr/local/bin/entrypoint.prod.sh
RUN chmod +x /usr/local/bin/entrypoint.prod.sh

# www-data's default HOME (/var/www) isn't writable by it; Tectonic needs a
# writable HOME for its bundle cache (~/.cache/tectonic), so point it at the
# already-persisted, already www-data-owned storage volume.
ENV HOME=/app/storage/app

USER 33:33
ENTRYPOINT ["/usr/local/bin/entrypoint.prod.sh"]
