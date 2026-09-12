document.querySelectorAll('[data-tool="image-resizer"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-resizer-input]");
    const widthInput = root.querySelector("[data-image-resizer-width]");
    const heightInput = root.querySelector("[data-image-resizer-height]");
    const keepRatioInput = root.querySelector("[data-image-resizer-keep-ratio]");
    const canvas = root.querySelector("[data-image-resizer-canvas]");
    const downloadButton = root.querySelector("[data-image-resizer-download]");
    const context = canvas?.getContext("2d");
    if (!fileInput || !(canvas instanceof HTMLCanvasElement) || !context) return;
    let naturalWidth = 0;
    let naturalHeight = 0;
    let dataUrl;
    function draw() {
        const width = parseInt(widthInput?.value, 10) || naturalWidth;
        const height = parseInt(heightInput?.value, 10) || naturalHeight;
        if (!width || !height || !dataUrl) return;
        canvas.width = width;
        canvas.height = height;
        canvas.hidden = false;
        const image = new Image();
        image.onload = () => {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
        };
        image.src = dataUrl;
        if (downloadButton) downloadButton.disabled = false;
    }
    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            dataUrl = reader.result;
            const probe = new Image();
            probe.onload = () => {
                naturalWidth = probe.naturalWidth;
                naturalHeight = probe.naturalHeight;
                if (widthInput) widthInput.value = String(naturalWidth);
                if (heightInput) heightInput.value = String(naturalHeight);
                draw();
            };
            probe.src = dataUrl;
        };
        reader.readAsDataURL(file);
    });
    widthInput?.addEventListener("input", () => {
        if (keepRatioInput?.checked && naturalWidth && naturalHeight) {
            const width = parseInt(widthInput.value, 10) || naturalWidth;
            heightInput.value = String(Math.round((width * naturalHeight) / naturalWidth));
        }
        draw();
    });
    heightInput?.addEventListener("input", () => {
        if (keepRatioInput?.checked && naturalWidth && naturalHeight) {
            const height = parseInt(heightInput.value, 10) || naturalHeight;
            widthInput.value = String(Math.round((height * naturalWidth) / naturalHeight));
        }
        draw();
    });
    downloadButton?.addEventListener("click", () =>
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "resized-image.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }, "image/png"),
    );
});
