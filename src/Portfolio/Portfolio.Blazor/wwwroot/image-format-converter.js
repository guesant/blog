const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
document.querySelectorAll('[data-tool="image-format-converter"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-format-converter-input]");
    const formatSelect = root.querySelector("[data-image-format-converter-format]");
    const canvas = root.querySelector("[data-image-format-converter-canvas]");
    const downloadButton = root.querySelector("[data-image-format-converter-download]");
    const context = canvas?.getContext("2d");
    if (!fileInput || !(canvas instanceof HTMLCanvasElement) || !context) return;
    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas.hidden = false;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
                if (downloadButton) downloadButton.disabled = false;
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
    downloadButton?.addEventListener("click", () => {
        const mimeType = formatSelect?.value || "image/png";
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `converted-image.${extensions[mimeType] || "png"}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            },
            mimeType,
            0.92,
        );
    });
});
