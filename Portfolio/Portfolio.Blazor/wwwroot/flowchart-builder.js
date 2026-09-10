import { renderFlowchart } from "./shared/diagram.js";

document.querySelectorAll('[data-tool="flowchart-builder"]').forEach((root) => {
    const input = root.querySelector("[data-flowchart-input]");
    const chart = root.querySelector("[data-flowchart-chart]");
    const error = root.querySelector("[data-flowchart-error]");
    const download = root.querySelector("[data-flowchart-download]");
    if (![input, chart, error, download].every(Boolean)) return;
    function update() {
        try {
            renderFlowchart(chart, input.value, root.dataset.chartLabel || "flowchart");
            error.textContent = "";
        } catch (reason) {
            error.textContent = reason.message;
            chart.replaceChildren();
        }
    }
    download.addEventListener("click", () => {
        const svg = chart.querySelector("svg");
        if (!svg) return;
        const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
            type: "image/svg+xml",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "fluxograma.svg";
        anchor.click();
        URL.revokeObjectURL(url);
    });
    input.addEventListener("input", update);
    update();
});
