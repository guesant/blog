window.echartsTools = (() => {
    const charts = new Map();
    let libraryPromise;

    function ensureLibrary() {
        if (typeof window.echarts === "object") return Promise.resolve();
        if (libraryPromise) return libraryPromise;
        libraryPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/vendor/echarts/echarts.min.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = () => {
                libraryPromise = null;
                reject(new Error("Could not load ECharts."));
            };
            document.head.appendChild(script);
        });
        return libraryPromise;
    }

    async function initializeMatrix(id, values) {
        const host = document.getElementById(id);
        if (!host || !Array.isArray(values)) return;
        await ensureLibrary();
        const current = charts.get(id);
        if (current) current.dispose();
        const chart = window.echarts.init(host);
        const rows = values.map((row) => row.map(Number));
        const size = rows.length;
        const data = rows.flatMap((row, y) => row.map((value, x) => [x, y, value]));
        chart.setOption({
            animation: false,
            tooltip: { position: "top" },
            grid: { height: "70%", top: "8%" },
            xAxis: {
                type: "category",
                data: Array.from({ length: size }, (_, index) => `x${index + 1}`),
            },
            yAxis: {
                type: "category",
                data: Array.from({ length: size }, (_, index) => `y${index + 1}`),
            },
            visualMap: {
                min: Math.min(...rows.flat()),
                max: Math.max(...rows.flat()),
                calculable: true,
                orient: "horizontal",
                left: "center",
                bottom: "0%",
            },
            series: [{ type: "heatmap", data, label: { show: true } }],
        });
        const resize = () => chart.resize();
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        charts.set(id, {
            dispose: () => {
                observer.disconnect();
                chart.dispose();
            },
        });
    }

    return { initializeMatrix };
})();
