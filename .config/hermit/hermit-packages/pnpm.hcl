description = "pnpm package manager used by the portfolio workspace."
binaries = ["pnpm"]

platform "linux" {
  source = "https://github.com/pnpm/pnpm/releases/download/v${version}/pnpm-linux-x64.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/pnpm/pnpm/releases/download/v${version}/pnpm-linux-arm64.tar.gz"
}

requires = ["node-24.18.0"]
version "11.17.0" {}

sha256sums = {
  "https://github.com/pnpm/pnpm/releases/download/v11.17.0/pnpm-linux-x64.tar.gz": "bdb1db01bf0f757495405a59a09c5c287f315889dc98d3b14bc374b9fe43a0bf",
  "https://github.com/pnpm/pnpm/releases/download/v11.17.0/pnpm-linux-arm64.tar.gz": "730d17de742a3efbb020ba91d7acfc0456c6ba6ad1cd8eb49f4c229fe9f504d3",
}
