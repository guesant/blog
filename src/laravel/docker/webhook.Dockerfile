FROM debian:bookworm-slim@sha256:88200866dfff7ea7f5cbcb6ec7c8a701889efe6fe859fe64d6990e4b07ea4171

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git docker.io gosu \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Official static binary from the project's own GitHub releases, same
# provenance pattern already used for Tectonic in app.prod.Dockerfile —
# never a third-party repackaged image.
ARG WEBHOOK_SHA256_AMD64=3cdf93f0615f11bfc575c158d0d613666394228f6e830ff6f792178933773f7b
ARG WEBHOOK_SHA256_ARM64=960187f361ca49403e0d3fce546c0a1999095a4ee6934a57ab8fef3170f2ddc8
RUN ARCH="$(dpkg --print-architecture)" \
    && case "$ARCH" in \
        amd64) WEBHOOK_TARGET="linux-amd64"; WEBHOOK_SHA256="$WEBHOOK_SHA256_AMD64" ;; \
        arm64) WEBHOOK_TARGET="linux-arm64"; WEBHOOK_SHA256="$WEBHOOK_SHA256_ARM64" ;; \
        *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;; \
    esac \
    && curl --proto '=https' -sSfL \
        "https://github.com/adnanh/webhook/releases/download/2.8.3/webhook-${WEBHOOK_TARGET}.tar.gz" \
        -o /tmp/webhook.tar.gz \
    && printf '%s  %s\n' "$WEBHOOK_SHA256" /tmp/webhook.tar.gz > /tmp/webhook.sha256 \
    && sha256sum -c /tmp/webhook.sha256 \
    && tar -xzf /tmp/webhook.tar.gz -C /tmp \
    && mv "/tmp/webhook-${WEBHOOK_TARGET}/webhook" /usr/local/bin/webhook \
    && rm -rf /tmp/webhook.tar.gz /tmp/webhook.sha256 "/tmp/webhook-${WEBHOOK_TARGET}"

COPY docker/hooks.json /etc/webhook/hooks.json

RUN useradd --create-home --shell /usr/sbin/nologin webhook

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000
# nosemgrep: dockerfile.security.missing-user-entrypoint.missing-user-entrypoint -- see IMPORTANT comment above; docker-entrypoint.sh drops root via gosu before running webhook
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "webhook", "-hooks", "/etc/webhook/hooks.json", "-template", "-verbose", "-ip", "0.0.0.0", "-port", "9000"]
