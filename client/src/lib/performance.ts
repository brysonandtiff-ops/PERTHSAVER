// Performance optimization utilities

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy image loading
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const imgElement = entry.target as HTMLImageElement;
        if (imgElement.dataset.src) {
          imgElement.src = imgElement.dataset.src;
          imgElement.classList.remove("skeleton");
          observer.unobserve(imgElement);
        }
      }
    });
  });

  observer.observe(img);
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Optimize CSS animations based on user preference
export function initializeAnimationOptimizations() {
  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty("--animation-duration", "0.01ms");
  }
}

// Report Web Vitals for monitoring
export function reportWebVitals(metric: any) {
  // You can send to analytics service
}

// Preload critical assets
export function preloadCriticalAssets(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = url.endsWith(".css") ? "style" : "script";
    link.href = url;
    document.head.appendChild(link);
  });
}

// Check connection speed and adjust quality
export function getConnectionSpeed(): "slow" | "fast" {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return "fast";
  
  const effectiveType = connection.effectiveType;
  return effectiveType === "slow-2g" || effectiveType === "2g" ? "slow" : "fast";
}
