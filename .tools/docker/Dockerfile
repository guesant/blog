ARG NODE_IMAGE=node:24-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6

FROM mvdan/shfmt:v3.14.1@sha256:8c06884a35683d8763fba6c0d9484d11a61a96da65f8d497d6f625825a6043f2 AS shfmt

FROM debian:bookworm-slim@sha256:3783cc01769c7b2b1b83a5c5ad96c815348e28ed7da68e2e3687004faa906251 AS tools
COPY --from=shfmt /bin/shfmt /usr/local/bin/shfmt
RUN apt-get update \
    && apt-get install --yes --no-install-recommends bash ca-certificates git grep \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace

FROM ${NODE_IMAGE} AS ast-grep
RUN npm install --global --no-audit --no-fund @ast-grep/cli@0.45.3
ENTRYPOINT ["ast-grep"]

FROM ${NODE_IMAGE} AS jscpd
RUN npm install --global --no-audit --no-fund jscpd@5.2.0
ENTRYPOINT ["jscpd"]

FROM lycheeverse/lychee:0.24.2@sha256:e2d19e57cf6ab037026f20b8e449a1f30d9d7f81eef4194763aab2eab20bd28d AS lychee
ENTRYPOINT ["lychee"]

FROM python:3.13-slim@sha256:8d9d0b8bcf6506481eae4907c18f5e3e7902e629f5f6d684f9e7c32e85e3ddf0 AS lizard
RUN pip install --no-cache-dir lizard==1.18.0
ENTRYPOINT ["lizard"]

FROM python:3.13-slim@sha256:8d9d0b8bcf6506481eae4907c18f5e3e7902e629f5f6d684f9e7c32e85e3ddf0 AS yamllint
RUN pip install --no-cache-dir yamllint==1.38.0
ENTRYPOINT ["yamllint"]

FROM koalaman/shellcheck:v0.11.0@sha256:61862eba1fcf09a484ebcc6feea46f1782532571a34ed51fedf90dd25f925a8d AS shellcheck
ENTRYPOINT ["shellcheck"]

FROM rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667 AS actionlint
ENTRYPOINT ["actionlint"]

FROM ghcr.io/zizmorcore/zizmor:1.30.1@sha256:a2eb396d886c053073405c7a980f2139ba2248ec172243cfa3841e57196e8101 AS zizmor
ENTRYPOINT ["zizmor"]

FROM hadolint/hadolint:v2.15.1@sha256:32dac94127fd60b7b7e3fbfc65e1383b9b5e25c9bfd7b8536de7a539fe68a12d AS hadolint
ENTRYPOINT ["hadolint"]

FROM zricethezav/gitleaks:v8.30.1@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f AS gitleaks
ENTRYPOINT ["gitleaks"]

FROM ghcr.io/google/osv-scanner:v2.5.1@sha256:8108ae94eadea5a02c9bec6e646909d5b790b44bd62d7f5b7f0b1d6d0ffc7734 AS osv-scanner
ENTRYPOINT ["/osv-scanner"]

FROM aquasec/trivy:0.74.0@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969 AS trivy
ENTRYPOINT ["trivy"]

FROM semgrep/semgrep:1.151.0@sha256:d3d1be3a3770514d16a6a57b9761575d7536d70f45a5220274f4ec7d55c442b9 AS semgrep
ENTRYPOINT ["semgrep"]

FROM ghcr.io/qltysh/qlty:main@sha256:14886acf71ad4957af7fe8ac1060c955d28df8ef8e7208b854655605018bacee AS qlty
ENTRYPOINT ["qlty"]

FROM ghcr.io/ossf/scorecard:v5.4.0@sha256:546c3f019eb24974abda92004a9003e4059a10e9ee13b1c3ab40d29f4f32f764 AS scorecard
ENTRYPOINT ["/scorecard"]
