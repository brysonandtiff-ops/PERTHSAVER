import React, { useState } from "react";

type SafeAvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallbackText?: string;
};

function svgFallbackDataURI(label: string) {
  const safe = (label || "PS").slice(0, 2).toUpperCase();
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3B82F6" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#F59E0B" stop-opacity="0.8"/>
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="28" fill="#0C111A"/>
    <rect width="128" height="128" rx="28" fill="url(#g)"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
      font-size="44" font-weight="700" fill="#FFFFFF">${safe}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function SafeAvatar({
  src,
  alt = "avatar",
  size = 32,
  className = "",
  fallbackText = "PS",
}: SafeAvatarProps) {
  const [broken, setBroken] = useState(false);

  const finalSrc = !src || broken ? svgFallbackDataURI(fallbackText) : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.35),
        objectFit: "cover",
      }}
      onError={() => setBroken(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
