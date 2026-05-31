import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// ─── Transformation helpers ───────────────────────────────────────────────────

/**
 * Returns an optimized thumbnail URL from any Cloudinary public ID.
 * Forces WebP, auto-quality, gravity-auto smart crop.
 */
export function thumbnailUrl(publicId: string, width = 400, height = 540): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    format: 'webp',
    quality: 'auto',
    fetch_format: 'auto',
  })
}

/**
 * Hero image — full-width cinematic format, 1200px max.
 */
export function heroUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 1200,
    crop: 'limit',
    format: 'webp',
    quality: 'auto:best',
    fetch_format: 'auto',
  })
}

/**
 * Blur placeholder — tiny base64 encoded thumbnail (20px wide).
 */
export async function blurPlaceholder(url: string): Promise<string> {
  const result = await cloudinary.url(url, {
    width: 20,
    crop: 'scale',
    format: 'webp',
    quality: 1,
    effect: 'blur:1000',
  })
  return result
}