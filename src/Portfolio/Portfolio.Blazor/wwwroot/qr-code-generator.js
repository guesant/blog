window.qrCodeGenerator = {
    download(svg) {
        const image = new Image();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            canvas.getContext("2d").drawImage(image, 0, 0, 256, 256);
            canvas.toBlob((png) => {
                if (!png) return;
                const pngUrl = URL.createObjectURL(png);
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = "qr-code.png";
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(pngUrl);
                URL.revokeObjectURL(url);
            });
        };
        image.src = url;
    },
};
