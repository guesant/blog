const matrices = {
    protanopia: [
        [0.567, 0.433, 0],
        [0.558, 0.442, 0],
        [0, 0.242, 0.758],
    ],
    deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7],
    ],
    tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.433, 0.567],
        [0, 0.475, 0.525],
    ],
};

function applyMatrix(imageData, matrix) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
        data[i + 1] = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
        data[i + 2] = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
    }
    return imageData;
}

document.querySelectorAll('[data-tool="colorblindness-simulator"]').forEach((root) => {
    const fileInput = root.querySelector("[data-colorblindness-simulator-input]");
    const grid = root.querySelector("[data-colorblindness-simulator-grid]");
    if (!fileInput || !grid) return;
    const canvases = Object.fromEntries(
        ["original", "protanopia", "deuteranopia", "tritanopia"].map((key) => [
            key,
            root.querySelector(`[data-colorblindness-simulator-canvas="${key}"]`),
        ]),
    );
    if (Object.values(canvases).some((canvas) => !canvas)) return;

    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = image;
                grid.hidden = false;
                const original = canvases.original;
                original.width = width;
                original.height = height;
                const originalContext = original.getContext("2d");
                originalContext.drawImage(image, 0, 0, width, height);
                const base = originalContext.getImageData(0, 0, width, height);
                Object.entries(matrices).forEach(([key, matrix]) => {
                    const canvas = canvases[key];
                    canvas.width = width;
                    canvas.height = height;
                    const context = canvas.getContext("2d");
                    context.putImageData(
                        applyMatrix(
                            new ImageData(new Uint8ClampedArray(base.data), width, height),
                            matrix,
                        ),
                        0,
                        0,
                    );
                });
            };
            image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
    });
});
