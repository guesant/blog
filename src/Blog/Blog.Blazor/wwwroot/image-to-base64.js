function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} b`;
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} kb` : `${(kb / 1024).toFixed(2)} mb`;
}
document.querySelectorAll('[data-tool="image-to-base64"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-to-base64-input]");
    const output = root.querySelector("[data-image-to-base64-output]");
    const charCount = root.querySelector("[data-image-to-base64-char-count]");
    const approxSize = root.querySelector("[data-image-to-base64-approx-size]");
    const copyButton = root.querySelector("[data-image-to-base64-copy]");
    const copyLabel = root.querySelector("[data-image-to-base64-copy-label]");
    let copyTimeout;
    if (!fileInput || !output) return;
    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            output.value = dataUrl;
            if (charCount) charCount.textContent = String(dataUrl.length);
            if (approxSize)
                approxSize.textContent = formatBytes(Math.round((dataUrl.length * 3) / 4));
        };
        reader.readAsDataURL(file);
    });
    copyButton?.addEventListener("click", () => {
        if (!output.value || !copyLabel) return;
        navigator.clipboard
            .writeText(output.value)
            .then(() => {
                clearTimeout(copyTimeout);
                copyLabel.textContent = copyLabel.dataset.copiedLabel;
                copyTimeout = setTimeout(() => {
                    copyLabel.textContent = copyLabel.dataset.copyLabel;
                }, 2000);
            })
            .catch(() => {});
    });
});
