FROM mvdan/shfmt:v3.14.1@sha256:8c06884a35683d8763fba6c0d9484d11a61a96da65f8d497d6f625825a6043f2 AS shfmt

FROM node:24.20.0-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e AS tools
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false
WORKDIR /opt/quality-tools
COPY tools/quality-tools/package.json tools/quality-tools/package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund \
    && ln -s /opt/quality-tools/node_modules/.bin/prettier /usr/local/bin/prettier \
    && ln -s /opt/quality-tools/node_modules/.bin/jscpd /usr/local/bin/jscpd
COPY --from=shfmt /bin/shfmt /usr/local/bin/shfmt
WORKDIR /src
