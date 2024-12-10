import { jwtDecode } from 'jwt-decode';
import * as jose from 'jose';
import { User, Permission, ROLE_PERMISSIONS } from '../types/auth';

const SECRET_KEY = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || 'your-secret-key-min-32-chars-long!!!!!!'
);

export async function generateToken(payload: object): Promise<string> {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);
  
  return jwt;
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function hasPermission(user: User, permission: Permission): boolean {
  return ROLE_PERMISSIONS[user.role].includes(permission);
}