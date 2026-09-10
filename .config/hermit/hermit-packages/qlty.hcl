description = "Pinned Qlty binary for code-smell validation."
binaries = ["*/qlty"]

platform "linux" {
  source = "https://github.com/qltysh/qlty/releases/download/v0.640.0/qlty-x86_64-unknown-linux-gnu.tar.xz"
}

platform "linux" "arm64" {
  source = "https://github.com/qltysh/qlty/releases/download/v0.640.0/qlty-aarch64-unknown-linux-gnu.tar.xz"
}

version "0.640.0" {}

sha256sums = {
  "https://github.com/qltysh/qlty/releases/download/v0.640.0/qlty-x86_64-unknown-linux-gnu.tar.xz": "854789f1f29d3b72892876ce9a0c57a6ee727c1a9b23d9ab149fb9ee33177bc7",
  "https://github.com/qltysh/qlty/releases/download/v0.640.0/qlty-aarch64-unknown-linux-gnu.tar.xz": "7b220858271755c2a4e7c5b733b77b7764ed4715ace102e082c64c3675bd5cd3",
}
