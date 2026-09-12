document.querySelectorAll('[data-tool="svg-to-png"]').forEach((root) => {
    const fileInput = root.querySelector("[data-svg-to-png-file]");
    const textarea = root.querySelector("[data-svg-to-png-input]");
    const widthInput = root.querySelector("[data-svg-to-png-width]");
    const heightInput = root.querySelector("[data-svg-to-png-height]");
    const renderButton = root.querySelector("[data-svg-to-png-render]");
    const errorText = root.querySelector("[data-svg-to-png-error]");
    const canvas = root.querySelector("[data-svg-to-png-canvas]");
    const downloadButton = root.querySelector("[data-svg-to-png-download]");
    const context = canvas?.getContext("2d");
    if (!textarea || !(canvas instanceof HTMLCanvasElement) || !context) return;
    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            textarea.value = String(reader.result);
        };
        reader.readAsText(file);
    });
    function render() {
        const svgText = textarea.value.trim();
        if (!svgText) return;
        const width = parseInt(widthInput?.value, 10) || 512;
        const height = parseInt(heightInput?.value, 10) || 512;
        if (errorText) errorText.hidden = true;
        if (downloadButton) downloadButton.disabled = true;
        const url = URL.createObjectURL(
            new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
        );
        const image = new Image();
        image.onload = () => {
            canvas.width = width;
            canvas.height = height;
            canvas.hidden = false;
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            URL.revokeObjectURL(url);
            if (downloadButton) downloadButton.disabled = false;
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            canvas.hidden = true;
            if (errorText) {
                errorText.hidden = false;
                errorText.textContent = errorText.dataset.invalidLabel;
            }
        };
        image.src = url;
    }
    renderButton?.addEventListener("click", render);
    downloadButton?.addEventListener("click", () =>
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "converted-image.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }, "image/png"),
    );
});
