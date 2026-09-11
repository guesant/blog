function findContentActionsRoot(button) {
    const directRoot = button.closest("[data-content-actions]");
    if (directRoot) {
        return directRoot;
    }
    const menu = button.closest('[role="menu"]');
    const triggerId = menu?.getAttribute("aria-labelledby");
    const trigger = triggerId ? document.getElementById(triggerId) : null;
    return trigger?.closest("[data-content-actions]") ?? null;
}

function toAbsoluteUrl(value) {
    return new URL(value, window.location.href).href;
}

function readContentActionsData(root) {
    return {
        title: root.dataset.contentActionsTitle || document.title,
        url: toAbsoluteUrl(root.dataset.contentActionsUrl || window.location.href),
        filename: root.dataset.contentActionsFilename || "content",
        markdown: root.querySelector("[data-content-actions-markdown]")?.content?.textContent ?? "",
        text: root.querySelector("[data-content-actions-text]")?.content?.textContent ?? "",
    };
}

function downloadContentActionsFile(content, type, extension, filename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type }));
    link.download = `${filename}.${extension}`;
    link.click();
    URL.revokeObjectURL(link.href);
}

const CONTENT_ACTIONS_FEEDBACK_MS = 900;

function closeContentActionsMenu(button) {
    const disclosure = button.closest("details[open]");
    if (disclosure) {
        disclosure.open = false;
        return;
    }
    button
        .closest('[role="menu"]')
        ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}

async function copyContentActions(button, clipboardText) {
    if (!navigator.clipboard) {
        return;
    }
    await navigator.clipboard.writeText(clipboardText).catch(() => {});
    const label = button.querySelector("span");
    if (!label) {
        closeContentActionsMenu(button);
        return;
    }
    const original = label.dataset.label ?? label.textContent;
    label.textContent = label.dataset.copiedLabel;
    setTimeout(() => {
        label.textContent = original;
        closeContentActionsMenu(button);
    }, CONTENT_ACTIONS_FEEDBACK_MS);
}

const CONTENT_ACTIONS_HANDLERS = {
    "copy-url": (data, button) => copyContentActions(button, data.url),
    "copy-text": (data, button) => copyContentActions(button, data.text),
    "copy-markdown": (data, button) => copyContentActions(button, data.markdown),
    "download-txt": (data, button) => {
        downloadContentActionsFile(data.text, "text/plain", "txt", data.filename);
        closeContentActionsMenu(button);
    },
    "download-md": (data, button) => {
        downloadContentActionsFile(data.markdown, "text/markdown", "md", data.filename);
        closeContentActionsMenu(button);
    },
};

function closeOpenDisclosures(event) {
    for (const disclosure of document.querySelectorAll("details.site-dropdown-details[open]")) {
        if (!disclosure.contains(event.target)) {
            disclosure.open = false;
        }
    }
}

async function handleContentActionsClick(event) {
    closeOpenDisclosures(event);
    const button = event.target.closest("[data-content-actions-action]");
    if (!button) {
        return;
    }
    const root = findContentActionsRoot(button);
    if (!root) {
        return;
    }
    const data = readContentActionsData(root);
    const handler = CONTENT_ACTIONS_HANDLERS[button.dataset.contentActionsAction];
    if (handler) {
        await handler(data, button);
    }
}

function menuItemsIn(menu) {
    return Array.from(menu.querySelectorAll('[role="menuitem"]'));
}

// IMPORTANT: the static <details>/<summary> fallback (App.razor's PageRenderMode makes content
// detail routes fully static, so the interactive BbDropdownMenu branch never mounts there) gets no
// keyboard behavior for free from the browser beyond Space/Enter toggling the disclosure - Escape
// and arrow-key navigation between items have to be wired up by hand.
function handleContentActionsMenuKeydown(event) {
    const menu = event.target.closest('[role="menu"]');
    if (!menu) {
        return;
    }
    const disclosure = menu.closest("details[open]");
    if (!disclosure) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        const summary = disclosure.querySelector("summary");
        disclosure.open = false;
        summary?.focus();
        return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
    }

    const items = menuItemsIn(menu);
    if (items.length === 0) {
        return;
    }
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement);
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + delta + items.length) % items.length;
    items[nextIndex].focus();
}

if (!document.body.dataset.contentActionsClickBound) {
    document.body.dataset.contentActionsClickBound = "true";
    document.addEventListener("click", handleContentActionsClick);
    document.addEventListener("keydown", handleContentActionsMenuKeydown);
}
