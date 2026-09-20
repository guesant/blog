import { fromBase64Url } from './codec.ts';
import { decryptProtectedEmail } from './decrypt.ts';
import { decoder, deriveProtectedEmailKey } from './shared.ts';
import type { ProtectedEmailChallenge } from './types.ts';
import { assertBoundedParams } from './assert-bounded-params.ts';
import { assertSupportedFormat } from './assert-supported-format.ts';

export { ProtectedEmailChallengeError } from './challenge-error.ts';

export async function solveEmailChallenge(challenge: ProtectedEmailChallenge): Promise<string> {
  assertSupportedFormat(challenge);
  assertBoundedParams(challenge.params);

  const salt = fromBase64Url(challenge.salt);

  const key = await deriveProtectedEmailKey(salt, challenge.params);

  const iv = fromBase64Url(challenge.iv);

  const ciphertext = fromBase64Url(challenge.ciphertext);

  const plaintext = await decryptProtectedEmail(key, iv, ciphertext);

  return decoder.decode(plaintext);
}
