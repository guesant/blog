description = "Pinned Tectonic support-bundle index; document files remain lazy and cached by Tectonic."
binaries = ["tlextras-2022.0r0.tar.index.gz"]
dont-extract = true
env = {
  TECTONIC_BUNDLE_INDEX: "${root}/tlextras-2022.0r0.tar.index.gz"
}

platform "linux" {
  source = "https://data1.fullyjustified.net/tlextras-2022.0r0.tar.index.gz"
}

platform "linux" "arm64" {
  source = "https://data1.fullyjustified.net/tlextras-2022.0r0.tar.index.gz"
}

version "2022.0r0" {}

sha256sums = {
  "https://data1.fullyjustified.net/tlextras-2022.0r0.tar.index.gz": "979a52178eb353c803dde1f66efe43ff7ae2ab908000323d4fef29e98e382ebd",
}
