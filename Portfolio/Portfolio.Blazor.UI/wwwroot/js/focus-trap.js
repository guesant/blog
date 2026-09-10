(() => {
    let activeTrap = null;
    let triggerElement = null;

    const getFocusable = (container) =>
        Array.from(
            container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        ).filter((el) => !el.disabled && el.offsetParent !== null);

    const release = () => {
        if (activeTrap) {
            activeTrap.container.removeEventListener("keydown", activeTrap.handler);
            activeTrap = null;
        }
    };

    const trap = (container) => {
        triggerElement = document.activeElement;
        release();

        const handler = (event) => {
            if (event.key !== "Tab") return;
            const focusable = getFocusable(container);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        container.addEventListener("keydown", handler);
        activeTrap = { container, handler };
    };

    const restoreFocus = () => {
        if (triggerElement && typeof triggerElement.focus === "function") {
            triggerElement.focus();
        }
        triggerElement = null;
    };

    window.SiteFocusTrap = { trap, release, restoreFocus };
})();
