import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const SECRET = new TextEncoder().encode(
  process.env.RESET_TOKEN_SECRET || process.env.NEXTAUTH_SECRET || 'your-reset-token-secret-key-min-32-chars'
);

interface ResetTokenPayload {
  email: string;
  token: string;
}

export async function generateResetToken(email: string): Promise<string> {
  const token = nanoid(32);
  
  const jwtToken = await new SignJWT({ email, token })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Token expires in 1 hour
    .sign(SECRET);
  
  return jwtToken;
}

export async function verifyResetToken(token: string): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as ResetTokenPayload;
  } catch {
    return null;
  }
}

export async function isValidResetToken(token: string, email: string): Promise<boolean> {
  const payload = await verifyResetToken(token);
  return Boolean(payload && payload.email === email);
}
