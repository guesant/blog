import assert from 'node:assert/strict';
import test from 'node:test';
import { createEmailChallenge } from './create.server.ts';
import { ProtectedEmailChallengeError, solveEmailChallenge } from './index.ts';
import { DEFAULT_ARGON2ID_PARAMS, MAX_ARGON2ID_PARAMS } from './params.ts';
import type { ProtectedEmailChallenge } from './types.ts';

const email = 'someone@example.com';

test('createEmailChallenge/solveEmailChallenge roundtrip returns the original address', async () => {
  const challenge = await createEmailChallenge(email);

  const solved = await solveEmailChallenge(challenge);

  assert.equal(solved, email);
});

test('rejects a tampered ciphertext', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: ProtectedEmailChallenge = {
    ...challenge,
    ciphertext:
      challenge.ciphertext.slice(0, -2) + (challenge.ciphertext.at(-2) === 'A' ? 'B' : 'A'),
  };

  await assert.rejects(() => solveEmailChallenge(tampered));
});

test('rejects a tampered iv', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: ProtectedEmailChallenge = {
    ...challenge,
    iv: challenge.iv.slice(0, -2) + (challenge.iv.at(-2) === 'A' ? 'B' : 'A'),
  };

  await assert.rejects(() => solveEmailChallenge(tampered));
});

test('rejects a tampered salt', async () => {
  const challenge = await createEmailChallenge(email);

  const tampered: ProtectedEmailChallenge = {
    ...challenge,
    salt: challenge.salt.slice(0, -2) + (challenge.salt.at(-2) === 'A' ? 'B' : 'A'),
  };

  await assert.rejects(() => solveEmailChallenge(tampered));
});

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
