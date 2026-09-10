import { existsSync } from "node:fs";

try {
    process.loadEnvFile();
} catch {}

const configuredBaseURL = process.env.LAYOUT_AUDIT_BASE_URL ?? "http://localhost:8080";
const runningInDocker = existsSync("/.dockerenv") || existsSync("/run/.containerenv");

export const layoutAuditConfig = {
    baseURL: runningInDocker
        ? configuredBaseURL.replace("localhost", "host.docker.internal")
        : configuredBaseURL,
};

export const routes = [
    { path: "/", label: "home" },
    { path: "/?kind=achado", label: "findings-feed" },
    { path: "/findings/raft-refresher", label: "finding-detail" },
    { path: "/projects", label: "projects-list" },
    { path: "/cases", label: "cases-list" },
    { path: "/credits", label: "credits-list" },
    { path: "/snippets", label: "snippets-list" },
    { path: "/technologies", label: "technologies-list" },
    { path: "/topics", label: "topics-list" },
    { path: "/knowledge-map", label: "knowledge-map" },
    { path: "/tools/password-generator", label: "tool-password-generator" },
    { path: "/tools/qr-code-generator", label: "tool-qr-code-generator" },
    { path: "/tools/unit-converter", label: "tool-unit-converter" },
    { path: "/tools/complex-number-calculator", label: "tool-complex-number-calculator" },
];

export const viewports = [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 800 },
];
