/**
 * Perth Fuel Price Provider
 * Wraps FuelWatch WA RSS Feed with standardized provenance metadata.
 */

import { fetchFuelPrices, FUEL_TYPES, type FuelStation } from "../../fuelwatch";
import { createProvenance, type ProvenanceWrapper } from "../provenance";

export interface PerthFuelResult {
  stations: FuelStation[];
  fuelType: string;
  suburb?: string;
  cheapestStation?: FuelStation;
  averagePrice: number;
}

export async function getPerthFuelPricesWithProvenance(
  fuelTypeNum: number = FUEL_TYPES.ULP,
  suburb?: string
): Promise<ProvenanceWrapper<PerthFuelResult>> {
  try {
    const raw = await fetchFuelPrices(fuelTypeNum, suburb);
    const stations = raw.stations || [];
    
    const prices = stations.map(s => parseFloat(s.price)).filter(p => !isNaN(p) && p > 0);
    const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const cheapest = stations.length > 0 ? stations[0] : undefined;

    return {
      data: {
        stations,
        fuelType: raw.fuelType,
        suburb,
        cheapestStation: cheapest,
        averagePrice: parseFloat(avg.toFixed(1)),
      },
      provenance: createProvenance(
        "WA FuelWatch (Government RSS)",
        "official",
        {
          sourceUrl: "https://www.fuelwatch.wa.gov.au/tools/rss",
          fetchedAt: raw.lastUpdated || new Date().toISOString(),
          maxAgeMs: 30 * 60 * 1000, // 30 mins TTL
          notes: "Official Western Australian Government FuelWatch data updated daily at 2:30 PM",
        }
      ),
    };
  } catch (error) {
    console.error("[FuelProvider] Error fetching FuelWatch data:", error);
    
    // Return safe fallback container with explicit error notes
    return {
      data: {
        stations: [],
        fuelType: "Unleaded (ULP 91)",
        suburb,
        averagePrice: 0,
      },
      provenance: createProvenance(
        "WA FuelWatch (Fallback)",
        "estimated",
        {
          notes: "Live feed temporarily unavailable. Please retry shortly.",
        }
      ),
    };
  }
}
