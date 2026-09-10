function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} b`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} kb`;
    return `${(kb / 1024).toFixed(2)} mb`;
}

document.querySelectorAll('[data-tool="image-compressor"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-compressor-input]");
    const formatSelect = root.querySelector("[data-image-compressor-format]");
    const qualityInput = root.querySelector("[data-image-compressor-quality]");
    const qualityValue = root.querySelector("[data-image-compressor-quality-value]");
    const canvas = root.querySelector("[data-image-compressor-canvas]");
    const originalSizeEl = root.querySelector("[data-image-compressor-original-size]");
    const compressedSizeEl = root.querySelector("[data-image-compressor-compressed-size]");
    const reductionEl = root.querySelector("[data-image-compressor-reduction]");
    const downloadButton = root.querySelector("[data-image-compressor-download]");
    const context = canvas?.getContext("2d");
    if (!fileInput || !(canvas instanceof HTMLCanvasElement) || !context) return;
    let originalSize = 0;
    let updateToken = 0;

    function update() {
        if (canvas.width === 0 || canvas.height === 0) return;
        const mimeType = formatSelect?.value || "image/jpeg";
        const quality = (parseInt(qualityInput?.value, 10) || 80) / 100;
        const token = ++updateToken;
        canvas.toBlob(
            (blob) => {
                if (!blob || token !== updateToken) return;
                if (compressedSizeEl) compressedSizeEl.textContent = formatBytes(blob.size);
                if (reductionEl && originalSize > 0)
                    reductionEl.textContent = `${Math.max(0, Math.round((1 - blob.size / originalSize) * 100))}%`;
                if (downloadButton) downloadButton.disabled = false;
            },
            mimeType,
            quality,
        );
    }

    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        originalSize = file.size;
        if (originalSizeEl) originalSizeEl.textContent = formatBytes(originalSize);
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas.hidden = false;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
                update();
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
    qualityInput?.addEventListener("input", () => {
        if (qualityValue) qualityValue.textContent = qualityInput.value;
        update();
    });
    formatSelect?.addEventListener("change", update);
    downloadButton?.addEventListener("click", () => {
        const mimeType = formatSelect?.value || "image/jpeg";
        const quality = (parseInt(qualityInput?.value, 10) || 80) / 100;
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `compressed-image.${mimeType === "image/webp" ? "webp" : "jpg"}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            },
            mimeType,
            quality,
        );
    });
});
