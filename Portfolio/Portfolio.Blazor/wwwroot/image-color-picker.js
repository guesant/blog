function toHex({ r, g, b }) {
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function toRgbString({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}

document.querySelectorAll('[data-tool="image-color-picker"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-color-picker-input]");
    const canvas = root.querySelector("[data-image-color-picker-canvas]");
    const swatch = root.querySelector("[data-image-color-picker-swatch]");
    const hexOutput = root.querySelector("[data-image-color-picker-hex]");
    const rgbOutput = root.querySelector("[data-image-color-picker-rgb]");
    const copyHexButton = root.querySelector("[data-image-color-picker-copy-hex]");
    const copyRgbButton = root.querySelector("[data-image-color-picker-copy-rgb]");
    const context = canvas?.getContext("2d", { willReadFrequently: true });

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
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(((event.clientX - rect.left) * canvas.width) / rect.width);
        const y = Math.floor(((event.clientY - rect.top) * canvas.height) / rect.height);
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
        const [r, g, b] = context.getImageData(x, y, 1, 1).data;
        const rgb = { r, g, b };
        const hex = toHex(rgb);
        const rgbText = toRgbString(rgb);
        if (swatch) swatch.style.backgroundColor = rgbText;
        if (hexOutput) hexOutput.value = hex;
        if (rgbOutput) rgbOutput.value = rgbText;
    });

    const copy = (input) => {
        if (input?.value) navigator.clipboard.writeText(input.value).catch(() => {});
    };
    copyHexButton?.addEventListener("click", () => copy(hexOutput));
    copyRgbButton?.addEventListener("click", () => copy(rgbOutput));
});
