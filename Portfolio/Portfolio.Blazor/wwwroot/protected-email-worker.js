importScripts("/vendor/hash-wasm/argon2.umd.min.js");

const password = "portfolio-contact-challenge-v1";
const decode = (value) => {
    const base64 = value
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
    return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

self.onmessage = async (event) => {
    try {
        const challenge = event.data;
        const params = challenge.params;
        if (
            challenge.version !== 1 ||
            challenge.algorithm !== "argon2id-aes256gcm" ||
            params.memoryKib > 393216 ||
            params.iterations > 64 ||
            params.parallelism > 4 ||
            params.hashLength > 64
        )
            throw new Error("unsupported challenge");
        const keyHex = await self.hashwasm.argon2id({
            password,
            salt: decode(challenge.salt),
            memorySize: params.memoryKib,
            iterations: params.iterations,
            parallelism: params.parallelism,
            hashLength: params.hashLength,
            outputType: "hex",
        });
        const key = await crypto.subtle.importKey(
            "raw",
            Uint8Array.from(keyHex.match(/../g).map((byte) => parseInt(byte, 16))),
            { name: "AES-GCM" },
            false,
            ["decrypt"],
        );
        const email = new TextDecoder().decode(
            await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: decode(challenge.iv) },
                key,
                decode(challenge.ciphertext),
            ),
        );
        self.postMessage({ ok: true, email });
    } catch (error) {
        self.postMessage({ ok: false, message: String(error?.message ?? error) });
    }
};
