import React, { useState, useEffect } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  cacheBust?: boolean;
};

/**
 * Asset Reliability Layer - SafeImage Component
 * 
 * Features:
 * - Automatic fallback to SVG data URI on load failure
 * - Optional cache-bust querystring for preview builds
 * - Loading state handling
 * - Retry mechanism for transient failures
 */

// Generate a fallback SVG for missing images
function generateFallbackSVG(width: number, height: number, text: string = "Image"): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="url(#accent)"/>
      <text 
        x="50%" y="50%" 
        text-anchor="middle" 
        dominant-baseline="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${Math.min(width, height) * 0.1}"
        fill="rgba(255,255,255,0.4)"
      >${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

// Cache-bust helper
function addCacheBust(url: string): string {
  if (!url || url.startsWith("data:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${Date.now()}`;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackComponent,
  width = 100,
  height = 100,
  className = "",
  style,
  onLoad,
  onError,
  cacheBust = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(cacheBust ? addCacheBust(src) : src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const numWidth = typeof width === "string" ? parseInt(width, 10) || 100 : width;
  const numHeight = typeof height === "string" ? parseInt(height, 10) || 100 : height;

  useEffect(() => {
    setImgSrc(cacheBust ? addCacheBust(src) : src);
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src, cacheBust]);

  const handleError = () => {
    if (retryCount < 1 && !hasError) {
      // Retry once with cache bust
      setRetryCount(1);
      setImgSrc(addCacheBust(src));
      return;
    }

    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(generateFallbackSVG(numWidth, numHeight, alt.slice(0, 10)));
    }
    
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // If we have a fallback component and image errored, show it
  if (hasError && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        ...style,
        opacity: isLoading ? 0.5 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
}

// Logo-specific component with Perth Saver branding fallback
export function SafeLogo({
  src,
  alt = "Perth Saver",
  size = 48,
  className = "",
}: {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#06b6d4"/>
          <stop offset="1" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="#0f172a"/>
      <rect width="128" height="128" rx="28" fill="url(#logo-bg)" opacity="0.2"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui" font-size="52" font-weight="800" fill="#06b6d4">$</text>
    </svg>
  `;

  return (
    <SafeImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      fallbackSrc={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSVG.trim())}`}
      cacheBust={process.env.NODE_ENV === "development"}
    />
  );
}

export default SafeImage;
