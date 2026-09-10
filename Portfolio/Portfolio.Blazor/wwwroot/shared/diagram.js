const SVG_NS = "http://www.w3.org/2000/svg";
function element(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
}
export function parseFlowchart(source) {
    const edges = source
        .split(/\r?\n/)
        .map((line) => line.split(/\s*[-=]>\s*/))
        .filter(([from, to]) => from?.trim() && to?.trim())
        .map(([from, to]) => [from.trim(), to.trim()]);
    if (!edges.length) throw new Error("no connections found in Origin -> Destination format.");
    const nodes = [...new Set(edges.flat())];
    return { edges, nodes };
}
export function renderFlowchart(container, source, label = "flowchart") {
    const { edges, nodes } = parseFlowchart(source);
    const width = 760;
    const height = Math.max(220, nodes.length * 74);
    container.replaceChildren();
    const svg = element("svg", {
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": label,
        class: "tool-chart",
    });
    const marker = element("marker", {
        id: "flow-arrow",
        viewBox: "0 0 10 10",
        refX: "9",
        refY: "5",
        markerWidth: "6",
        markerHeight: "6",
        orient: "auto-start-reverse",
    });
    marker.append(element("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "currentcolor" }));
    const defs = element("defs");
    defs.append(marker);
    svg.append(defs);
    const positions = new Map(
        nodes.map((node, index) => [node, { x: width / 2, y: 48 + index * 74 }]),
    );
    edges.forEach(([from, to]) => {
        const start = positions.get(from);
        const end = positions.get(to);
        svg.append(
            element("line", {
                x1: start.x,
                y1: start.y + 20,
                x2: end.x,
                y2: end.y - 20,
                class: "tool-chart-line",
                "marker-end": "url(#flow-arrow)",
            }),
        );
    });
    nodes.forEach((node) => {
        const { x, y } = positions.get(node);
        svg.append(
            element("rect", {
                x: x - 112,
                y: y - 20,
                width: 224,
                height: 40,
                rx: 10,
                class: "tool-chart-bar",
            }),
        );
        const text = element("text", { x, y: y + 5, "text-anchor": "middle" });
        text.textContent = node;
        svg.append(text);
    });
    container.append(svg);
    return { edges, nodes };
}
