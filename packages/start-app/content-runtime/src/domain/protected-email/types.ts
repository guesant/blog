export type Argon2idParams = {
  memorySize: number;
  iterations: number;
  parallelism: number;
  hashLength: number;
};

export type ProtectedEmailChallenge = {
  version: 2;
  algorithm: 'argon2id-aes256gcm';
  salt: string;
  iv: string;
  ciphertext: string;
  params: Argon2idParams;
};
