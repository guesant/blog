try {
    process.loadEnvFile();
} catch {}

export const vrtConfig = {
    baseURL: process.env.VRT_BASE_URL ?? "http://localhost:8081",
};
