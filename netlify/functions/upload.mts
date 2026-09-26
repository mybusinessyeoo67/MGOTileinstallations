import type { Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'

const MAX_BYTES = 6 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  let body: { contentType?: string; data?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const contentType = body.contentType || ''
  const ext = ALLOWED_TYPES[contentType]
  if (!ext) return new Response('Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG.', { status: 400 })
  if (!body.data) return new Response('Missing file data', { status: 400 })

  const bytes = Buffer.from(body.data, 'base64')
  if (bytes.byteLength > MAX_BYTES) return new Response('File too large (max 6MB)', { status: 400 })

  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const store = getStore('site-images')
  await store.set(key, bytes)

  return Response.json({ key, url: `/media/${key}` })
}

export const config: Config = {
  path: '/api/upload',
}
