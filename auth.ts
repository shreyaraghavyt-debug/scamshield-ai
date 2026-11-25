import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db.ts';

const EPHEMERAL_FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');

function getSessionSecret(): string {
  return process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16
    ? process.env.SESSION_SECRET
    : EPHEMERAL_FALLBACK_SECRET;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const keyBuffer = Buffer.from(keyHex, 'hex');
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
}

export function signSessionToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    sub: userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(sigB64);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as TokenPayload;
    if (!parsed.sub || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  created_at: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: AuthUser;
}

function loadUserFromHeader(req: Request): AuthUser | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  const token = authHeader.slice(7).trim();
  const payload = verifySessionToken(token);
  if (!payload) return undefined;

  const row = db
    .prepare('SELECT id, full_name, email, email_verified, created_at FROM profiles WHERE id = ?')
    .get(payload.sub) as
    | { id: string; full_name: string; email: string; email_verified: number; created_at: string }
    | undefined;

  if (!row) return undefined;
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    email_verified: Boolean(row.email_verified),
    created_at: row.created_at,
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = loadUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  req.authUser = user;
  next();
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  req.authUser = loadUserFromHeader(req);
  next();
}
