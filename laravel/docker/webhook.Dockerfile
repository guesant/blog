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
    && echo "$WEBHOOK_SHA256  /tmp/webhook.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/webhook.tar.gz -C /tmp \
    && mv "/tmp/webhook-${WEBHOOK_TARGET}/webhook" /usr/local/bin/webhook \
    && rm -rf /tmp/webhook.tar.gz "/tmp/webhook-${WEBHOOK_TARGET}"

COPY docker/hooks.json /etc/webhook/hooks.json

RUN useradd --create-home --shell /usr/sbin/nologin webhook

# IMPORTANT: the entrypoint below starts as root and stays root through its
# own setup step — it has to, because /var/run/docker.sock is bind-mounted
# at container start (docker-compose.prod.yml) and the GID that owns it on
# the host isn't known until then. The script joins that GID at runtime,
# then uses gosu to drop to the unprivileged `webhook` user before exec'ing
# the listener that parses untrusted GitLab webhook payloads, so the
# attacker-facing process itself never runs as root. docker.sock access
# stays root-equivalent regardless of container UID (see the
# docker-compose.prod.yml comment on that accepted trade-off); this only
# narrows the blast radius of a bug in the webhook binary itself.
RUN cat <<'ENTRYPOINT_SCRIPT' > /usr/local/bin/docker-entrypoint.sh
#!/usr/bin/env bash
set -euo pipefail

SOCKET=/var/run/docker.sock
if [ -S "$SOCKET" ]; then
    SOCKET_GID="$(stat -c '%g' "$SOCKET")"
    if ! getent group "$SOCKET_GID" >/dev/null; then
        groupadd -g "$SOCKET_GID" docker-host
    fi
    usermod -aG "$SOCKET_GID" webhook
fi

exec gosu webhook "$@"
ENTRYPOINT_SCRIPT
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000
# nosemgrep: dockerfile.security.missing-user-entrypoint.missing-user-entrypoint -- see IMPORTANT comment above; docker-entrypoint.sh drops root via gosu before running webhook
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "webhook", "-hooks", "/etc/webhook/hooks.json", "-template", "-verbose", "-ip", "0.0.0.0", "-port", "9000"]
