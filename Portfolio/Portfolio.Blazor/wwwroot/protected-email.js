(() => {
    const reveal = (root) =>
        new Promise(async (resolve) => {
            const panels = root.querySelectorAll("[data-protected-email-state]");
            const trigger = root.querySelector("[data-protected-email-trigger]");
            const set = (state) =>
                panels.forEach((panel) => {
                    panel.hidden = panel.dataset.protectedEmailState !== state;
                });
            set("working");
            trigger.hidden = true;
            try {
                const response = await fetch("/api/protected-email/challenge", {
                    method: "POST",
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                });
                if (!response.ok) throw new Error(`challenge request failed: ${response.status}`);
                const challenge = await response.json();
                const worker = new Worker("/protected-email-worker.js");
                worker.onmessage = (event) => {
                    worker.terminate();
                    if (!event.data.ok) {
                        set("error");
                        resolve();
                        return;
                    }
                    const link = root.querySelector("[data-protected-email-revealed]");
                    link.href = `mailto:${event.data.email}`;
                    link.querySelector("[data-protected-email-revealed-text]").textContent =
                        event.data.email;
                    set("revealed");
                    resolve();
                };
                worker.onerror = () => {
                    worker.terminate();
                    set("error");
                    resolve();
                };
                worker.postMessage(challenge);
            } catch {
                set("error");
                resolve();
            }
        });
    document.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const trigger = target?.closest(
            "[data-protected-email-trigger], [data-protected-email-retry]",
        );
        const root = trigger?.closest("[data-protected-email]");
        if (!root) return;
        event.preventDefault();
        if (root.dataset.protectedEmailBusy === "true") return;
        root.dataset.protectedEmailBusy = "true";
        reveal(root).finally(() => {
            root.dataset.protectedEmailBusy = "false";
        });
    });
})();
