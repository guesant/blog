// IMPORTANT: pax.BlazorChartJs does `import(chartJsLocation)` and then reads the global
// `Chart`, ignoring this module's exports. chart.umd.min.js is UMD, so importing it
// directly as an ES module leaves top-level `this` as `undefined` and its `this.Chart =
// factory()` fallback throws silently instead of setting `window.Chart`. Loading it via
// a classic <script> tag keeps `this === window`, which is what the UMD build needs.
if (typeof window !== "undefined" && !window.Chart) {
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL("./chart.umd.min.js", import.meta.url).href;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load chart.umd.min.js"));
    document.head.appendChild(script);
  });
}
