description = "Tectonic TeX engine used to generate the résumé PDFs."
binaries = ["tectonic"]

platform "linux" {
  source = "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${version}/tectonic-${version}-x86_64-unknown-linux-musl.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${version}/tectonic-${version}-aarch64-unknown-linux-musl.tar.gz"
}

version "0.16.9" {}

sha256sums = {
  "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.16.9/tectonic-0.16.9-x86_64-unknown-linux-musl.tar.gz": "60b13a0826ae7ad9ce34b4a2df06bff2cfcfa6dda8a915477c0cbb84e1a4a902",
  "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.16.9/tectonic-0.16.9-aarch64-unknown-linux-musl.tar.gz": "f9aa39017dbd51f111fdb93dda222178cbe51c8193508fc567b523cc74fff9c1",
}
