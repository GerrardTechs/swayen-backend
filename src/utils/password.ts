import argon2 from "argon2";

// Argon2id dipilih sesuai rekomendasi OWASP untuk password hashing modern
export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}
