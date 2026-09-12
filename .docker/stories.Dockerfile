FROM mcr.microsoft.com/dotnet/sdk@sha256:e1fc6e423f543119c406d24e2e687d67c569f18f04a37a8b0005d80ad0dcee80
RUN apt-get update && apt-get install -y --no-install-recommends python3 \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*
RUN dotnet workload install wasm-tools --skip-manifest-update
