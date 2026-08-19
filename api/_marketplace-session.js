import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const COOKIE_NAME = 'coconoto_marketplace_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const base64url = (value) => Buffer.from(value).toString('base64url');

const getSecret = () => {
  // We deliberately refuse to fall back to the Supabase service-role key:
  // anyone who can read that env value can forge marketplace cookies.
  const secret = process.env.MARKETPLACE_SESSION_SECRET;
  if (!secret) {
    throw new Error('MARKETPLACE_SESSION_SECRET is not configured');
  }
  return secret;
};

const sign = (payload) => crypto
  .createHmac('sha256', getSecret())
  .update(payload)
  .digest('base64url');

// `isSeller`/`vendorId` let a buyer who opted in to sell keep a single session
// while still reaching seller-only endpoints (product management, etc.).
export const createSessionToken = (session) => {
  const payload = base64url(JSON.stringify({
    id: session.id,
    role: session.role,
    email: session.email,
    name: session.name,
    isSeller: !!session.isSeller,
    vendorId: session.vendorId || null,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }));
  return `${payload}.${sign(payload)}`;
};

export const readSession = (req) => {
  const cookieHeader = req.headers?.cookie || '';
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return null;
  const token = decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1));
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.id || !['buyer', 'vendor'].includes(session.role) || session.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const setSessionCookie = (res, session) => {
  const token = createSessionToken(session);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`);
};

export const clearSessionCookie = (res) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`);
};

export const requireSession = (req, res, role) => {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ success: false, error: 'Please sign in to continue' });
    return null;
  }
  if (role && session.role !== role) {
    res.status(403).json({ success: false, error: `${role === 'buyer' ? 'Buyer' : 'Vendor'} access required` });
    return null;
  }
  return session;
};

let adminClient;
export const getMarketplaceSupabase = () => {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Marketplace Supabase service credentials are not configured');
    adminClient = createClient(url, key, { auth: { persistSession: false } });
  }
  return adminClient;
};

export const publicSession = (session) => session ? {
  id: session.id,
  role: session.role,
  email: session.email,
  name: session.name,
  isSeller: !!session.isSeller,
  vendorId: session.vendorId || null,
} : null;
