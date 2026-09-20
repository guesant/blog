FROM node:24-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6

WORKDIR /opt/openapi-ts
RUN npm init --yes \
    && npm install --no-audit --no-fund @hey-api/openapi-ts@0.99.0 typescript@6.0.3

WORKDIR /workspace/src/public-app
ENV PATH=/opt/openapi-ts/node_modules/.bin:$PATH
ENTRYPOINT ["openapi-ts"]
