window.chartExport = (() => {
    function downloadPng(id, filename) {
        const host = document.getElementById(id);
        const canvas = host?.querySelector("canvas");
        if (!canvas) return false;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = filename;
        link.click();
        link.remove();
        return true;
    }

    return { downloadPng };
})();
