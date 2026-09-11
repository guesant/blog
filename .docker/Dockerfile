FROM mcr.microsoft.com/dotnet/sdk@sha256:e1fc6e423f543119c406d24e2e687d67c569f18f04a37a8b0005d80ad0dcee80 AS build
WORKDIR /src
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=true \
    NUGET_PACKAGES=/tmp/nuget-packages

# IMPORTANT: restore only after the full source copy. Restoring from a csproj-only layer,
# even solution-wide, silently drops _framework/blazor.web.js from the published static web
# assets manifest (a runtime 404 with no build error), so the restore layer is not cached.
COPY . .
RUN dotnet restore src/Portfolio.Blazor.slnx --locked-mode
RUN dotnet publish src/Portfolio/Portfolio.Blazor/Portfolio.Blazor.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet@sha256:a4556ed033fa96f984bb7a8d348851cb2d36b1281dd2420070045f664fbb5f94 AS runtime
ARG APP_COMMIT_SHA=""
ARG APP_BUILD_TIME=""
WORKDIR /app
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /data/sqlite /data/public /data/resume-cache \
    && chown -R app:app /data
COPY --from=build --chown=app:app /app/publish ./
COPY --chown=app:app tools/scripts/run-with-tectonic.sh /app/scripts/run-with-tectonic.sh
COPY --chown=app:app .docker/entrypoint.prod.sh /app/entrypoint.prod.sh
RUN chmod 0555 /app/scripts/run-with-tectonic.sh /app/entrypoint.prod.sh
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://0.0.0.0:8080 \
    PORTFOLIO_RUN_PUBLISHED=1 \
    PORTFOLIO_APP_DLL=/app/Portfolio.Blazor.dll \
    PORTFOLIO_SQLITE_PATH=/data/sqlite/portfolio.sqlite \
    PORTFOLIO_PUBLIC_ASSET_ROOT=/data/public \
    PORTFOLIO_RESUME_PDF_ROOT=/data/resume-cache \
    TECTONIC_BUNDLE=https://data1.fullyjustified.net/tlextras-2022.0r0.tar \
    TECTONIC_ONLY_CACHED=true \
    HOME=/data/resume-cache \
    XDG_CACHE_HOME=/data/resume-cache/.cache \
    APP_COMMIT_SHA=$APP_COMMIT_SHA \
    APP_BUILD_TIME=$APP_BUILD_TIME \
    DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=true
USER app
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=6 \
    CMD curl --fail --silent http://127.0.0.1:8080/health >/dev/null || exit 1
ENTRYPOINT ["/app/entrypoint.prod.sh"]
