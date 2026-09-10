document.querySelectorAll('[data-tool="image-dimension-calculator"]').forEach((root) => {
    const fileInput = root.querySelector("[data-image-dimension-file]");
    const widthInput = root.querySelector("[data-image-dimension-original-width]");
    const heightInput = root.querySelector("[data-image-dimension-original-height]");
    if (!fileInput || !widthInput || !heightInput) return;
    fileInput.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                widthInput.value = String(image.naturalWidth);
                heightInput.value = String(image.naturalHeight);
                widthInput.dispatchEvent(new Event("input", { bubbles: true }));
                heightInput.dispatchEvent(new Event("input", { bubbles: true }));
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
});
