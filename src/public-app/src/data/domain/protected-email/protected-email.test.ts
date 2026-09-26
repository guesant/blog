import assert from 'node:assert/strict';
import test from 'node:test';
import { createEmailChallenge } from './create.server.ts';
import { createTamperedChallenge } from './create-tampered-challenge.ts';
import { ProtectedEmailChallengeError, solveEmailChallenge } from './index.ts';
import { DEFAULT_ARGON2ID_PARAMS, MAX_ARGON2ID_PARAMS } from './params.ts';
import type { ProtectedEmailChallenge } from './types.ts';

const email = 'someone@example.com';

test('createEmailChallenge/solveEmailChallenge roundtrip returns the original address', async () => {
  const challenge = await createEmailChallenge(email);

  const solved = await solveEmailChallenge(challenge);

  assert.equal(solved, email);
});

for (const field of ['ciphertext', 'iv', 'salt'] as const) {
  test(`rejects a tampered ${field}`, async () => {
    const challenge = await createEmailChallenge(email);

    const tampered = createTamperedChallenge(challenge, field);

    await assert.rejects(() => solveEmailChallenge(tampered));
  });
}

test('rejects an unsupported challenge version', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: Omit<ProtectedEmailChallenge, 'version'> & { version: number } = {
    ...challenge,
    version: 1,
  };

  await assert.rejects(
    () => solveEmailChallenge(tampered as ProtectedEmailChallenge),
    ProtectedEmailChallengeError,
  );
});

test('rejects an unsupported algorithm', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: Omit<ProtectedEmailChallenge, 'algorithm'> & { algorithm: string } = {
    ...challenge,
    algorithm: 'pbkdf2-aes256gcm',
  };

  await assert.rejects(
    () => solveEmailChallenge(tampered as ProtectedEmailChallenge),
    ProtectedEmailChallengeError,
  );
});

test('rejects params that exceed the supported bounds', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: ProtectedEmailChallenge = {
    ...challenge,
    params: { ...challenge.params, memorySize: MAX_ARGON2ID_PARAMS.memorySize + 1 },
  };

  await assert.rejects(() => solveEmailChallenge(tampered), ProtectedEmailChallengeError);
});

test('default params stay within the supported bounds', () => {
  assert.ok(DEFAULT_ARGON2ID_PARAMS.memorySize <= MAX_ARGON2ID_PARAMS.memorySize);
  assert.ok(DEFAULT_ARGON2ID_PARAMS.iterations <= MAX_ARGON2ID_PARAMS.iterations);
  assert.ok(DEFAULT_ARGON2ID_PARAMS.parallelism <= MAX_ARGON2ID_PARAMS.parallelism);
  assert.ok(DEFAULT_ARGON2ID_PARAMS.hashLength <= MAX_ARGON2ID_PARAMS.hashLength);
});
