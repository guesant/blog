(() => {
    const viewModes = new Set(["dense", "spacious", "detailed"]);
    const wrapper = () => document.querySelector('[data-layout-region="wrapper"]');
    let lastKnownUrl = new URL(window.location.href);
    let pendingViewScroll = null;
    let scrollRestoreGeneration = 0;

    const scrollToTop = () => {
        const target = wrapper();
        if (target) target.scrollTo({ top: 0, left: 0, behavior: "auto" });
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const setMenuState = (open) => {
        const page = document.querySelector(".page-shell");
        const toggle = document.querySelector("[data-nav-toggle]");
        const backdrop = document.querySelector("[data-nav-backdrop]");
        if (!page || !toggle) return;
        const wasOpen = page.classList.contains("nav-open");
        page.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        if (backdrop) backdrop.setAttribute("aria-hidden", String(!open));

        // IMPORTANT: this off-canvas panel has no keyboard-native dismissal (it's plain
        // Blazor state via a CSS class, not a <dialog>) and moving focus into it on open
        // is what makes Escape-to-close and Tab navigation actually useful - without this,
        // a keyboard user who opens the panel stays focused on the now-hidden toggle button.
        if (open && !wasOpen) {
            const panel = document.querySelector("[data-nav-panel]");
            const firstLink = panel?.querySelector("a, button");
            firstLink?.focus();
        } else if (!open && wasOpen) {
            toggle.focus();
        }
    };

    let navigatedWithinSite = false;

    // IMPORTANT: enhanced navigation changes the URL through pushState without
    // updating document.referrer, so the referrer alone cannot tell whether the
    // history holds a page of this site. The flag records our own navigations.
    const canGoBackWithinSite = () => {
        if (navigatedWithinSite) return true;
        if (!document.referrer) return false;
        try {
            return new URL(document.referrer).origin === window.location.origin;
        } catch {
            return false;
        }
    };

    const changesPage = (element) => {
        if (!(element instanceof HTMLAnchorElement)) return false;
        if (element.hasAttribute("download") || element.target === "_blank") return false;

        const destination = new URL(element.href, window.location.href);
        if (destination.origin !== window.location.origin) return false;

        return (
            destination.pathname !== window.location.pathname ||
            destination.search !== window.location.search
        );
    };

    const normalizedQueryWithoutView = (url) => {
        const entries = [...url.searchParams.entries()]
            .filter(([key, value]) => !isViewParameter(key, value))
            .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
                const keyOrder = leftKey.localeCompare(rightKey);
                return keyOrder || leftValue.localeCompare(rightValue);
            });
        return JSON.stringify(entries);
    };

    const isViewParameter = (key, value) =>
        (key === "view" || key.startsWith("view_")) && viewModes.has(value.toLowerCase());

    const requiresScrollReset = (previous, next) => {
        if (!(previous instanceof URL) || !(next instanceof URL)) return true;
        if (previous.origin !== next.origin) return false;
        if (previous.pathname !== next.pathname) return true;
        if (previous.href === next.href) return false;

        // A view-only query change must preserve the reading position. Every
        // other query change (filters, sorting, or pagination) is a new list
        // state and should start at the top.
        return normalizedQueryWithoutView(previous) !== normalizedQueryWithoutView(next);
    };

    const currentUrl = () => new URL(window.location.href);

    const readScrollPosition = () => {
        const target = wrapper();
        return {
            wrapperTop: target?.scrollTop ?? 0,
            wrapperLeft: target?.scrollLeft ?? 0,
            windowX: window.scrollX,
            windowY: window.scrollY,
        };
    };

    const restoreScrollPosition = (position) => {
        const target = wrapper();
        if (target)
            target.scrollTo({
                top: position.wrapperTop,
                left: position.wrapperLeft,
                behavior: "auto",
            });
        window.scrollTo({ top: position.windowY, left: position.windowX, behavior: "auto" });
    };

    const scheduleScrollRestore = (position, generation) => {
        if (!position) return;
        // Interactive WebAssembly navigation does not always emit the
        // enhanced-navigation event. Repeat briefly so FocusOnNavigate and
        // the rendered view cannot overwrite the captured position.
        [0, 50, 150, 300, 600].forEach((delay) => {
            setTimeout(() => {
                if (generation === scrollRestoreGeneration) restoreScrollPosition(position);
            }, delay);
        });
    };

    const handleCompletedNavigation = () => {
        const nextUrl = currentUrl();
        const shouldReset = requiresScrollReset(lastKnownUrl, nextUrl);
        if (shouldReset) {
            pendingViewScroll = null;
            scrollRestoreGeneration++;
            scrollToTop();
        } else {
            scheduleScrollRestore(pendingViewScroll, scrollRestoreGeneration);
            pendingViewScroll = null;
        }
        lastKnownUrl = nextUrl;
    };

    document.addEventListener(
        "click",
        (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (target?.matches("[data-nav-backdrop]")) {
                setMenuState(false);
                return;
            }
            const action = target?.closest("a, button");
            if (!action) return;

            if (action.matches("[data-site-back]") && canGoBackWithinSite()) {
                event.preventDefault();
                window.history.back();
                return;
            }

            if (action.matches("[data-nav-toggle]")) {
                event.preventDefault();
                const page = document.querySelector(".page-shell");
                setMenuState(!page?.classList.contains("nav-open"));
                return;
            }

            // Revealing the protected email is an in-place action. It does not
            // navigate, so preserve the user's current scroll position.
            if (action.matches("[data-protected-email-trigger], [data-protected-email-retry]"))
                return;

            if (action.closest("[data-nav-panel]")) setMenuState(false);
            if (changesPage(action)) {
                navigatedWithinSite = true;
                const destination = new URL(action.href, window.location.href);
                if (requiresScrollReset(currentUrl(), destination)) {
                    pendingViewScroll = null;
                    scrollRestoreGeneration++;
                    setTimeout(scrollToTop, 0);
                } else {
                    // Blazor may focus the page heading after navigation. Capture
                    // the position before that happens and restore it afterward.
                    pendingViewScroll = readScrollPosition();
                    const generation = ++scrollRestoreGeneration;
                    scheduleScrollRestore(pendingViewScroll, generation);
                }
            }
        },
        true,
    );

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const page = document.querySelector(".page-shell");
        if (page?.classList.contains("nav-open")) setMenuState(false);
    });

    document.addEventListener("enhancednavigationend", handleCompletedNavigation);
    window.addEventListener("popstate", () => {
        const nextUrl = currentUrl();
        if (!requiresScrollReset(lastKnownUrl, nextUrl)) pendingViewScroll = readScrollPosition();
        handleCompletedNavigation();
    });
    window.siteNavigation = { scrollToTop, setMenuState, requiresScrollReset };
})();
