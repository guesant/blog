description = "Moon task runner pinned for the portfolio workspace."
binaries = ["moon", "moonx"]
strip = 1

platform "linux" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon_cli-x86_64-unknown-linux-gnu.tar.xz"
}

platform "linux" "arm64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon_cli-aarch64-unknown-linux-gnu.tar.xz"
}

version "2.4.6" {}

sha256sums = {
  "https://github.com/moonrepo/moon/releases/download/v2.4.6/moon_cli-x86_64-unknown-linux-gnu.tar.xz": "106a4b18ddd93e9485a396c14b3a7e287586a006ea201e6a0b37e9e221f51d97",
  "https://github.com/moonrepo/moon/releases/download/v2.4.6/moon_cli-aarch64-unknown-linux-gnu.tar.xz": "5eb8afeae1afca5a74efe8db9aafb1fc47ca5c10a0fe976b740f3ad45b3a5cae",
}

