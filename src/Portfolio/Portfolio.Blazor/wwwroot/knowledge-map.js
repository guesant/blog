(function () {
    var retryTimer;
    var resizeObserver;
    var cytoscapePromise;
    var LAYOUT_CACHE_PREFIX = "km-layout-v5-";
    var LABEL_MAX_CHARS = 26;

    function hashGraphKey(graph) {
        var ids = (graph.nodes || graph.elements || [])
            .map(function (el) {
                return (el.data && el.data.id) || "";
            })
            .sort()
            .join("|");
        var hash = 0;
        for (var i = 0; i < ids.length; i++) {
            hash = ((hash << 5) - hash + ids.charCodeAt(i)) | 0;
        }
        return LAYOUT_CACHE_PREFIX + hash + "-" + ids.length;
    }

    function loadCachedPositions(key, nodeIds) {
        try {
            var raw = window.localStorage.getItem(key);
            if (!raw) return null;
            var positions = JSON.parse(raw);
            for (var i = 0; i < nodeIds.length; i++) {
                if (!positions[nodeIds[i]]) return null;
            }
            return positions;
        } catch (_) {
            return null;
        }
    }

    function saveCachedPositions(key, cy) {
        try {
            var positions = {};
            cy.nodes().forEach(function (node) {
                positions[node.id()] = node.position();
            });
            window.localStorage.setItem(key, JSON.stringify(positions));
        } catch (_) {
            /* storage unavailable or full; skip caching silently */
        }
    }

    function ensureCytoscape() {
        if (window.cytoscape) return Promise.resolve();
        if (cytoscapePromise) return cytoscapePromise;
        cytoscapePromise = new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = "/vendor/cytoscape/cytoscape.min.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = function () {
                cytoscapePromise = null;
                reject(new Error("Could not load Cytoscape."));
            };
            document.head.appendChild(script);
        });
        return cytoscapePromise;
    }

    // IMPORTANT: the tokens are light-dark() expressions, so reading the custom property
    // itself returns the unresolved function text, which Cytoscape paints as black. Resolving
    // through a probe element's computed color yields the actual rgb for the active theme.
    function computedColor(name, fallback) {
        try {
            var probe = document.createElement("span");
            probe.style.color = "var(" + name + ")";
            probe.hidden = true;
            document.body.appendChild(probe);
            var value = getComputedStyle(probe).color;
            probe.remove();
            return value || fallback;
        } catch (_) {
            return fallback;
        }
    }

    function shortLabel(value) {
        var text = String(value || "").trim();
        if (text.length <= LABEL_MAX_CHARS) return text;
        var cut = text.slice(0, LABEL_MAX_CHARS - 1);
        var space = cut.lastIndexOf(" ");
        return (space > LABEL_MAX_CHARS / 2 ? cut.slice(0, space) : cut) + "…";
    }

    function buildStyle(kinds) {
        var text = computedColor("--site-text-primary", "#1a1a1a");
        var surface = computedColor("--site-surface", "#ffffff");
        var edge = computedColor("--site-border-strong", "#d4d4d4");
        var accent = computedColor("--site-primary", "#1d4ed8");
        var style = [
            {
                selector: "node",
                style: {
                    "background-color": accent,
                    label: "data(label)",
                    color: text,
                    "text-wrap": "wrap",
                    "text-max-width": 96,
                    "font-size": 11,
                    "text-valign": "bottom",
                    "text-margin-y": 10,
                    "text-background-color": surface,
                    "text-background-opacity": 0.85,
                    "text-background-padding": 3,
                    "text-background-shape": "roundrectangle",
                    width: 20,
                    height: 20,
                },
            },
            {
                selector: "edge",
                style: {
                    width: 1,
                    "line-color": edge,
                    "target-arrow-color": edge,
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier",
                },
            },
            {
                selector: "node.kmap-selected",
                style: {
                    label: "data(fullLabel)",
                    "border-width": 3,
                    "border-color": accent,
                    "z-index": 10,
                },
            },
        ];
        Object.keys(kinds).forEach(function (kind) {
            style.push({
                selector: 'node[kind = "' + kind + '"]',
                style: { "background-color": kinds[kind].color || accent },
            });
        });
        return style;
    }

    function watchTheme(cy, kinds) {
        var restyle = function () {
            cy.style(buildStyle(kinds));
        };
        new MutationObserver(restyle).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", restyle);
        }
    }

    function renderLegend(legendEl, kinds, nodes) {
        legendEl.innerHTML = "";
        var counts = {};
        nodes.forEach(function (node) {
            counts[node.data.kind] = (counts[node.data.kind] || 0) + 1;
        });
        Object.keys(kinds).forEach(function (kind) {
            var item = document.createElement("span");
            item.className = "kmap-legend-item";

            var swatch = document.createElement("span");
            swatch.className = "kmap-legend-swatch";
            swatch.style.backgroundColor =
                kinds[kind].color || computedColor("--site-primary", "#1d4ed8");
            item.appendChild(swatch);

            var text = document.createElement("span");
            text.className = "kmap-legend-text";
            text.textContent = (kinds[kind].label || kind) + " (" + (counts[kind] || 0) + ")";
            item.appendChild(text);

            legendEl.appendChild(item);
        });
    }

    function renderEmptyPanel(panelEl, label) {
        panelEl.innerHTML = "";
        var empty = document.createElement("p");
        empty.className = "kmap-panel-empty";
        empty.textContent = label;
        panelEl.appendChild(empty);
    }

    function renderNodePanel(panelEl, node, graph, config) {
        panelEl.innerHTML = "";

        var kindInfo = graph.kinds[node.data("kind")];
        var kind = document.createElement("p");
        kind.className = "kmap-panel-kind";
        kind.textContent = (kindInfo && kindInfo.label) || node.data("kind");
        panelEl.appendChild(kind);

        var title = document.createElement("p");
        title.className = "kmap-panel-title";
        title.textContent = node.data("fullLabel") || node.data("label");
        panelEl.appendChild(title);

        var url = node.data("url");
        if (url && url !== "#") {
            var link = document.createElement("a");
            link.className = "kmap-panel-link";
            link.href = url;
            link.textContent = config.panelOpenLabel + " →";
            panelEl.appendChild(link);
        }

        var connections = node
            .connectedEdges()
            .map(function (edge) {
                var otherId =
                    edge.data("source") === node.id() ? edge.data("target") : edge.data("source");
                var other = graph.cy.getElementById(otherId);
                if (!other || other.empty()) return null;
                return { edge: edge, other: other };
            })
            .filter(Boolean);

        if (connections.length === 0) return;

        var list = document.createElement("ul");
        list.className = "kmap-panel-connections";

        connections.forEach(function (connection) {
            var item = document.createElement("li");
            item.className = "kmap-panel-connection";

            var label = document.createElement("span");
            label.className = "kmap-panel-connection-label";
            label.textContent = connection.edge.data("label") + " ";
            item.appendChild(label);

            var otherUrl = connection.other.data("url");
            if (otherUrl && otherUrl !== "#") {
                var otherLink = document.createElement("a");
                otherLink.className = "kmap-panel-connection-link";
                otherLink.href = otherUrl;
                otherLink.textContent =
                    connection.other.data("fullLabel") || connection.other.data("label");
                item.appendChild(otherLink);
            } else {
                var otherLabel = document.createElement("span");
                otherLabel.className = "kmap-panel-connection-link";
                otherLabel.textContent =
                    connection.other.data("fullLabel") || connection.other.data("label");
                item.appendChild(otherLabel);
            }

            list.appendChild(item);
        });

        panelEl.appendChild(list);
    }

    function wireControls(shell, cy, graph) {
        if (shell.dataset.kmapWired === "true") return;
        shell.dataset.kmapWired = "true";
        graph.cy = cy;

        var config = {
            panelEmptyLabel:
                shell.dataset.panelEmptyLabel || "select a node to see its connections.",
            panelOpenLabel: shell.dataset.panelOpenLabel || "open",
            noResults: shell.dataset.noResults || "no nodes match this filter.",
        };

        var legendEl = shell.querySelector("[data-kmap-legend]");
        var panelEl = shell.querySelector("[data-kmap-panel]");
        var resetBtn = shell.querySelector("[data-kmap-reset]");
        var expandBtn = shell.querySelector("[data-kmap-expand]");
        var collapseBtn = shell.querySelector("[data-kmap-collapse]");
        var backdrop = (shell.parentElement || document).querySelector(
            "[data-kmap-fullscreen-backdrop]",
        );
        if (!legendEl || !panelEl) return;

        var state = { selectedId: null };

        renderLegend(legendEl, graph.kinds, graph.nodes);
        renderEmptyPanel(panelEl, config.panelEmptyLabel);

        function clearSelection() {
            state.selectedId = null;
            cy.nodes().removeClass("kmap-selected");
            renderEmptyPanel(panelEl, config.panelEmptyLabel);
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                clearSelection();
                cy.fit(undefined, 32);
            });
        }

        cy.on("tap", "node", function (event) {
            var node = event.target;
            state.selectedId = node.id();
            cy.nodes().removeClass("kmap-selected");
            node.addClass("kmap-selected");
            renderNodePanel(panelEl, node, graph, config);
        });

        cy.on("tap", function (event) {
            if (event.target === cy) clearSelection();
        });

        if (expandBtn && collapseBtn && backdrop) {
            var isFullscreen = false;

            function openFullscreen() {
                isFullscreen = true;
                shell.classList.add("is-fullscreen");
                backdrop.hidden = false;
                collapseBtn.hidden = false;
                expandBtn.hidden = true;
                document.body.style.overflow = "hidden";
                collapseBtn.focus();
                cy.resize();
                cy.fit(undefined, 32);
            }

            function closeFullscreen() {
                isFullscreen = false;
                shell.classList.remove("is-fullscreen");
                backdrop.hidden = true;
                collapseBtn.hidden = true;
                expandBtn.hidden = false;
                document.body.style.overflow = "";
                expandBtn.focus();
                cy.resize();
                cy.fit(undefined, 32);
            }

            expandBtn.addEventListener("click", openFullscreen);
            collapseBtn.addEventListener("click", closeFullscreen);
            backdrop.addEventListener("click", closeFullscreen);
            document.addEventListener("keydown", function (event) {
                if (isFullscreen && event.key === "Escape") closeFullscreen();
            });
        }
    }

    function initialize() {
        var root = document.getElementById("knowledge-map-cytoscape");
        var data = document.getElementById("knowledge-map-data");
        if (!root || !data) return;
        if (!window.cytoscape) {
            ensureCytoscape()
                .then(schedule)
                .catch(function () {
                    root.dataset.initialized = "false";
                });
            return;
        }
        if (root.dataset.initialized === "true") {
            if (root._knowledgeMap) {
                root._knowledgeMap.resize();
                root._knowledgeMap.fit(undefined, 32);
            }
            return;
        }
        if (root.dataset.initialized === "initializing") return;
        var rect = root.getBoundingClientRect();
        if (rect.width < 50 || rect.height < 50) {
            requestAnimationFrame(initialize);
            return;
        }
        var graph;
        try {
            graph = JSON.parse(data.textContent || "{}");
        } catch (_) {
            return;
        }
        graph.nodes = graph.nodes || [];
        graph.nodes.forEach(function (el) {
            if (!el.data) return;
            el.data.fullLabel = el.data.label || "";
            el.data.label = shortLabel(el.data.fullLabel);
        });
        graph.edges = graph.edges || [];
        graph.kinds = graph.kinds || {};
        var shell = root.closest("[data-kmap-root]");
        root.dataset.initialized = "initializing";
        try {
            var nodeIds = graph.nodes.map(function (el) {
                return (el.data && el.data.id) || "";
            });
            var cacheKey = hashGraphKey(graph);
            var cachedPositions = loadCachedPositions(cacheKey, nodeIds);
            var cy = window.cytoscape({
                container: root,
                elements: { nodes: graph.nodes, edges: graph.edges },
                layout: cachedPositions
                    ? { name: "preset", positions: cachedPositions, fit: true, padding: 32 }
                    : { name: "preset" },
                style: buildStyle(graph.kinds),
            });
            if (!cachedPositions) {
                var connected = cy.elements().filter(function (el) {
                    return el.isEdge() || el.degree() > 0;
                });
                var isolated = cy.nodes().filter(function (node) {
                    return node.degree() === 0;
                });
                connected
                    .layout({
                        name: "cose",
                        animate: false,
                        fit: false,
                        padding: 32,
                        idealEdgeLength: function (edge) {
                            var degree = Math.max(edge.source().degree(), edge.target().degree());
                            return 120 + degree * 10;
                        },
                        nodeRepulsion: function (node) {
                            return 80000 + node.degree() * 80000;
                        },
                        edgeElasticity: 20,
                        nodeOverlap: 80,
                        gravity: 0.15,
                        numIter: 3000,
                    })
                    .run();
                if (isolated.length) {
                    var bb = connected.boundingBox();
                    isolated
                        .layout({
                            name: "grid",
                            animate: false,
                            fit: false,
                            boundingBox: { x1: bb.x1, y1: bb.y2 + 40, w: bb.w, h: 200 },
                        })
                        .run();
                }
                cy.fit(undefined, 32);
                saveCachedPositions(cacheKey, cy);
            }
            root._knowledgeMap = cy;
            root.dataset.initialized = "true";
            requestAnimationFrame(function () {
                cy.resize();
                cy.fit(undefined, 32);
            });
            if (typeof ResizeObserver !== "undefined") {
                if (resizeObserver) resizeObserver.disconnect();
                resizeObserver = new ResizeObserver(function () {
                    cy.resize();
                    cy.fit(undefined, 32);
                });
                resizeObserver.observe(root);
            }
            watchTheme(cy, graph.kinds);
            if (shell) wireControls(shell, cy, graph);
        } catch (_) {
            root.dataset.initialized = "false";
            clearTimeout(retryTimer);
            retryTimer = setTimeout(initialize, 100);
        }
    }
    function schedule() {
        clearTimeout(retryTimer);
        retryTimer = setTimeout(initialize, 0);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
    else schedule();
    window.addEventListener("load", schedule);
    document.addEventListener("enhancedload", schedule);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
})();
