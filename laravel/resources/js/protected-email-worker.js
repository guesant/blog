import { argon2id } from 'hash-wasm';

const CHALLENGE_PASSWORD = 'portfolio-contact-challenge-v1';

// Safety cap: never run a derivation heavier than this, even if a
// challenge payload were tampered with client-side.
const MAX_PARAMS = { memoryKib: 393216, iterations: 64, parallelism: 4, hashLength: 64 };

function fromBase64Url(value) {
  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function solve(challenge) {
  if (challenge.version !== 1 || challenge.algorithm !== 'argon2id-aes256gcm') {
    throw new Error('Unsupported challenge version');
  }

  const { memoryKib, iterations, parallelism, hashLength } = challenge.params;
  if (
    memoryKib > MAX_PARAMS.memoryKib ||
    iterations > MAX_PARAMS.iterations ||
    parallelism > MAX_PARAMS.parallelism ||
    hashLength > MAX_PARAMS.hashLength
  ) {
    throw new Error('Challenge parameters exceed safety limits');
  }

  const salt = fromBase64Url(challenge.salt);
  const iv = fromBase64Url(challenge.iv);
  const ciphertext = fromBase64Url(challenge.ciphertext);

  const keyHex = await argon2id({
    password: CHALLENGE_PASSWORD,
    salt,
    memorySize: memoryKib,
    iterations,
    parallelism,
    hashLength,
    outputType: 'hex',
  });
  const keyBytes = fromHex(keyHex);

  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'decrypt',
  ]);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

  return new TextDecoder().decode(plaintext);
}

self.onmessage = async (event) => {
  try {
    const email = await solve(event.data);
    self.postMessage({ ok: true, email });
  } catch (error) {
    self.postMessage({ ok: false, message: String(error?.message ?? error) });
  }
};
