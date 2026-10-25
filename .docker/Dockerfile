FROM ghcr.io/gohugoio/hugo@sha256:1fb8fe7f417abd5802d86747d297728aa48078d763159e7dff6559fe3f8bb8e7

USER root
RUN apk add --no-cache bash just
WORKDIR /workspace
USER hugo
