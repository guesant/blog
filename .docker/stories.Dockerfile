FROM mcr.microsoft.com/dotnet/sdk@sha256:2fa828c68761b1b8c23d7662dc134421b9d3b59fe1425fdbc80804e390cdb24d
RUN apt-get update && apt-get install -y --no-install-recommends python3 \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*
RUN dotnet workload install wasm-tools --skip-manifest-update
