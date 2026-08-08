/**
 * PERTHSAVER DATA PROVENANCE & FRESHNESS ARCHITECTURE
 * Standardized metadata model for tracking data source, freshness, confidence, and accuracy.
 */

export type ConfidenceLevel = "official" | "verified" | "partner" | "community" | "estimated";

export interface DataProvenance {
  sourceName: string;
  sourceUrl?: string;
  fetchedAt: string;
  effectiveAt?: string;
  expiresAt?: string;
  isStale: boolean;
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface ProvenanceWrapper<T> {
  data: T;
  provenance: DataProvenance;
}

/**
 * Checks whether a given timestamp (ISO string or timestamp number) is older than maxAgeMs
 */
export function isDataStale(fetchedAt: string | number | Date, maxAgeMs: number): boolean {
  const fetchedTime = new Date(fetchedAt).getTime();
  if (isNaN(fetchedTime)) return true;
  return Date.now() - fetchedTime > maxAgeMs;
}

/**
 * Helper to construct standardized data provenance
 */
export function createProvenance(
  sourceName: string,
  confidence: ConfidenceLevel = "verified",
  options?: {
    sourceUrl?: string;
    fetchedAt?: string;
    effectiveAt?: string;
    expiresAt?: string;
    maxAgeMs?: number;
    notes?: string;
  }
): DataProvenance {
  const fetchedAt = options?.fetchedAt || new Date().toISOString();
  const maxAgeMs = options?.maxAgeMs || 24 * 60 * 60 * 1000; // Default 24h freshness threshold

  return {
    sourceName,
    sourceUrl: options?.sourceUrl,
    fetchedAt,
    effectiveAt: options?.effectiveAt || fetchedAt,
    expiresAt: options?.expiresAt,
    isStale: isDataStale(fetchedAt, maxAgeMs),
    confidence,
    notes: options?.notes,
  };
}
