import type { Argon2idParams } from './types.ts';

const kibibytesPerMebibyte = 1024;

/**
 * IMPORTANT: starting point, not benchmarked on real devices. Argon2id runs
 * single-threaded WASM in an unknown visitor browser, so this is intentionally
 * lighter than the OWASP server-side auth recommendations. Tune this file after
 * manual timing checks (DevTools CPU throttling, a real phone) once the feature
 * is live.
 */
export const DEFAULT_ARGON2ID_PARAMS: Argon2idParams = {
  memorySize: 19 * kibibytesPerMebibyte,
  iterations: 3,
  parallelism: 1,
  hashLength: 32,
};

/**
 * IMPORTANT: upper bounds enforced by solveEmailChallenge before running
 * Argon2id, so a tampered public challenge can't force a visitor's browser
 * into an excessive memory/time computation.
 */
export const MAX_ARGON2ID_PARAMS: Argon2idParams = {
  memorySize: 128 * kibibytesPerMebibyte,
  iterations: 10,
  parallelism: 4,
  hashLength: 64,
};
