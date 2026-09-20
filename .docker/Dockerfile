FROM node:24.20.0-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e AS dependencies
WORKDIR /app
ENV COREPACK_HOME=/tmp/corepack
COPY src/public-app/package.json src/public-app/pnpm-lock.yaml src/public-app/pnpm-workspace.yaml ./
RUN corepack enable && corepack pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:24.20.0-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e AS build
WORKDIR /app
ENV COREPACK_HOME=/tmp/corepack
COPY src/public-app/package.json src/public-app/pnpm-lock.yaml src/public-app/pnpm-workspace.yaml ./
RUN corepack enable && corepack pnpm install --frozen-lockfile --ignore-scripts
COPY src/public-app ./
RUN corepack pnpm build

FROM node:24.20.0-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e AS runtime
ARG APP_COMMIT_SHA=""
ARG APP_BUILD_TIME=""
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    APP_COMMIT_SHA=$APP_COMMIT_SHA \
    APP_BUILD_TIME=$APP_BUILD_TIME
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --chown=node:node .docker/entrypoint.prod.sh /usr/local/bin/entrypoint.prod.sh
RUN chmod 0555 /usr/local/bin/entrypoint.prod.sh
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=6 \
    CMD node -e "fetch('http://127.0.0.1:3000/pt-BR').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"
ENTRYPOINT ["/usr/local/bin/entrypoint.prod.sh"]
CMD ["./node_modules/.bin/srvx", "--prod", "-s", "dist/client", "dist/server/server.js"]
