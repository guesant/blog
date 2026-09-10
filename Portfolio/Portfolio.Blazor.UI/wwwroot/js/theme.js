(() => {
    const key = "site-theme";
    const values = new Set(["system", "light", "dark"]);
    const root = document.documentElement;

    const read = () => {
        try {
            const stored = localStorage.getItem(key);
            return values.has(stored) ? stored : "system";
        } catch {
            return "system";
        }
    };

    const apply = (value) => {
        if (value === "system") root.removeAttribute("data-theme");
        else root.setAttribute("data-theme", value);
    };

    const sync = () => {
        const current = read();
        document.querySelectorAll("[data-theme-value]").forEach((button) => {
            const active = button.getAttribute("data-theme-value") === current;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    };

    apply(read());

    document.addEventListener("click", (event) => {
        const target =
            event.target instanceof Element ? event.target.closest("[data-theme-value]") : null;
        if (!target) return;
        const value = target.getAttribute("data-theme-value");
        if (!values.has(value)) return;
        try {
            if (value === "system") localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        } catch {}
        apply(value);
        sync();
    });

    document.addEventListener("DOMContentLoaded", () => {
        sync();
        new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
    });
    // IMPORTANT: enhanced navigation diffs the new server document onto the live one, <html>
    // attributes included, and the server never knows the stored theme, so data-theme is wiped on
    // every in-site link click unless it is re-applied here.
    document.addEventListener("enhancednavigationend", () => {
        apply(read());
        sync();
    });
    new MutationObserver(() => {
        const expected = read();
        const actual = root.getAttribute("data-theme") ?? "system";
        if (actual !== expected) apply(expected);
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("storage", (event) => {
        if (event.key !== null && event.key !== key) return;
        apply(read());
        sync();
    });
    window.siteTheme = { read, apply, sync };
})();
