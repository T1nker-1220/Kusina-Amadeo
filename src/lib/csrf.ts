import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'your-csrf-secret-key-min-16-chars'
);
const CSRF_COOKIE_NAME = 'csrf';

export async function generateToken(): Promise<string> {
  const secret = nanoid(32); // Generate a random secret
  const token = await new SignJWT({ secret })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET);
  
  // Store the secret in a cookie
  cookies().set(CSRF_COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600, // 1 hour
  });
  
  return token;
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const secret = cookieStore.get(CSRF_COOKIE_NAME)?.value;
    
    if (!secret) {
      return false;
    }

    const { payload } = await jwtVerify(token, SECRET);
    return payload.secret === secret;
  } catch {
    return false;
  }
}

export async function clearToken(): Promise<void> {
  cookies().delete(CSRF_COOKIE_NAME);
}
