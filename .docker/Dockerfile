FROM mcr.microsoft.com/dotnet/sdk@sha256:2fa828c68761b1b8c23d7662dc134421b9d3b59fe1425fdbc80804e390cdb24d AS build
WORKDIR /src
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_NOLOGO=true \
    NUGET_PACKAGES=/tmp/nuget-packages

# IMPORTANT: restore only after the full source copy. Restoring from a csproj-only layer,
# even solution-wide, silently drops _framework/blazor.web.js from the published static web
# assets manifest (a runtime 404 with no build error), so the restore layer is not cached.
COPY . .
RUN dotnet restore src/Blog.Blazor.slnx --locked-mode
RUN dotnet publish src/Blog/Blog.Blazor/Blog.Blazor.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet@sha256:6a94333d37514e385650a3c81a55e5350b67253dbe136e9cf17e499c35606a8c AS runtime
ARG APP_COMMIT_SHA=""
ARG APP_BUILD_TIME=""
WORKDIR /app
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /data/public /data/resume-cache \
    && chown -R app:app /data
COPY --from=build --chown=app:app /app/publish ./
COPY --chown=app:app tools/scripts/run-with-tectonic.sh /app/scripts/run-with-tectonic.sh
COPY --chown=app:app .docker/entrypoint.prod.sh /app/entrypoint.prod.sh
RUN chmod 0555 /app/scripts/run-with-tectonic.sh /app/entrypoint.prod.sh
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://0.0.0.0:8080 \
    PORTFOLIO_RUN_PUBLISHED=1 \
    PORTFOLIO_APP_DLL=/app/Blog.Blazor.dll \
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
