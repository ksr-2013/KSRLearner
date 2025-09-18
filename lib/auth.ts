import jwt from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const COOKIE_NAME = 'ksr_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function signSession(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE })
}

export function verifySession(token: string) {
  try { return jwt.verify(token, JWT_SECRET) as any } catch { return null }
}

export function makeSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}; ${isProd ? 'Secure;' : ''}`
}

export function clearSessionCookie() {
  const isProd = process.env.NODE_ENV === 'production'
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${isProd ? 'Secure;' : ''}`
}

export function readTokenFromRequest(req: NextRequest) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match?.[1]
}


