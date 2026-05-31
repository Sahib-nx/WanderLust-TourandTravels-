import Image from 'next/image'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
}

/**
 * Wrapper around next/image for Cloudinary URLs.
 * Automatically appends transformation params for optimal delivery.
 */
export function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  quality = 85,
}: CloudinaryImageProps) {
  // Inject Cloudinary transformations into URL if not already present
  const optimizedSrc = src.includes('/upload/')
    ? src.replace('/upload/', `/upload/q_auto,f_auto,w_${width},h_${height},c_fill,g_auto/`)
    : src

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEhBRIxQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amx1Mu0jbSFW5EpMKEiCIJjJI6MuNuN+rXkj9M0oNjotjRaITvgJJJJJJJJJJJJAP/9k="
    />
  )
}