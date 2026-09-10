window.tableEditor = (() => {
    const instances = new Map();
    const resources = new Map();

    function loadScript(src, ready) {
        if (ready()) return Promise.resolve();
        if (resources.has(src)) return resources.get(src);
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => {
                resources.delete(src);
                reject(new Error(`Could not load ${src}`));
            };
            document.head.appendChild(script);
        });
        resources.set(src, promise);
        return promise;
    }

    function loadStyle(href) {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    async function initialize(id, headers, rows) {
        const host = document.getElementById(id);
        if (!host || !Array.isArray(headers)) return;
        loadStyle("/vendor/jsuites/jsuites.css");
        loadStyle("/vendor/jspreadsheet/jspreadsheet.css");
        await loadScript("/vendor/jsuites/jsuites.js", () => typeof window.jSuites !== "undefined");
        await loadScript(
            "/vendor/jspreadsheet/index.js",
            () => typeof window.jspreadsheet === "function",
        );
        const existing = instances.get(id);
        if (existing && typeof existing.destroy === "function") existing.destroy();
        host.replaceChildren();
        const columns = headers.map((title, index) => ({
            title: title || `Column ${index + 1}`,
            type: "text",
            width: 180,
        }));
        const instance = window.jspreadsheet(host, {
            worksheets: [
                {
                    data: Array.isArray(rows) ? rows : [],
                    columns,
                    minDimensions: [Math.max(headers.length, 1), Math.max((rows || []).length, 1)],
                },
            ],
        });
        instances.set(id, instance);
    }

    function downloadCsv(id, filename, headers, label) {
        const instance = instances.get(id);
        const worksheet = Array.isArray(instance) ? instance[0] : instance;
        const data =
            worksheet && typeof worksheet.getData === "function" ? worksheet.getData() : [];
        const escapeCell = (value) => {
            const text = value == null ? "" : String(value);
            return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
        };
        const csv = [headers, ...data].map((row) => row.map(escapeCell).join(",")).join("\r\n");
        const link = document.createElement("a");
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
        link.download = filename;
        link.click();
        link.remove();
    }

    async function initializeTabulator(id, headers, rows) {
        const host = document.getElementById(id);
        if (!host || !Array.isArray(headers)) return;
        loadStyle("/vendor/tabulator/tabulator.min.css");
        await loadScript(
            "/vendor/tabulator/tabulator.min.js",
            () => typeof window.Tabulator === "function",
        );
        const existing = instances.get(id);
        if (existing && typeof existing.destroy === "function") existing.destroy();
        host.replaceChildren();
        const data = (rows || []).map((row) =>
            Object.fromEntries(headers.map((_, index) => [`c${index}`, row[index] ?? ""])),
        );
        const columns = headers.map((title, index) => ({
            title: title || `Column ${index + 1}`,
            field: `c${index}`,
            headerSort: false,
        }));
        const instance = new window.Tabulator(host, {
            data,
            columns,
            layout: "fitColumns",
            responsiveLayout: "collapse",
            movableColumns: false,
        });
        instances.set(id, instance);
    }

    return { initialize, initializeTabulator, downloadCsv };
})();
