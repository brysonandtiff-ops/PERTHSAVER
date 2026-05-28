/**
 * FuelWatch WA API Integration
 * Fetches live fuel prices from the Western Australian Government FuelWatch RSS feed
 * API Docs: https://www.fuelwatch.wa.gov.au/tools/rss
 */

import { parseStringPromise } from 'xml2js';

export interface FuelStation {
  tradingName: string;
  brand: string;
  address: string;
  suburb: string;
  phone: string;
  latitude: string;
  longitude: string;
  price: string;
  date: string;
  siteFeatures: string;
}

export interface FuelWatchResponse {
  stations: FuelStation[];
  lastUpdated: string;
  fuelType: string;
}

// Product codes from FuelWatch API
export const FUEL_TYPES = {
  ULP: 1,      // Unleaded Petrol
  PULP: 2,     // Premium Unleaded
  DIESEL: 4,   // Diesel
  LPG: 5,      // LPG
  RON98: 6,    // 98 RON
  E85: 10,     // E85
  BRAND_DIESEL: 11, // Brand Diesel
} as const;

// Perth metro regions
export const REGIONS = {
  NORTH_OF_RIVER: 1,
  SOUTH_OF_RIVER: 2,
  EAST_OF_RIVER: 3,
  FREMANTLE: 4,
  ROCKINGHAM: 5,
  MANDURAH: 6,
} as const;

const FUELWATCH_BASE_URL = 'https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS';

// Cache for fuel prices (TTL: 30 minutes) - keyed by fuelType + suburb + region
const priceCache = new Map<string, {
  data: FuelWatchResponse;
  timestamp: number;
}>();

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCacheKey(fuelType: number, suburb?: string, region?: number): string {
  return `${fuelType}:${suburb || ''}:${region || ''}`;
}

export async function fetchFuelPrices(
  fuelType: number = FUEL_TYPES.ULP,
  suburb?: string,
  region?: number
): Promise<FuelWatchResponse> {
  const now = Date.now();
  const cacheKey = getCacheKey(fuelType, suburb, region);
  
  // Check cache for same fuel type + suburb + region combination
  const cached = priceCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`[FuelWatch] Cache hit for: ${cacheKey}`);
    return cached.data;
  }

  try {
    // Build URL with parameters
    const params = new URLSearchParams();
    params.append('Product', fuelType.toString());
    params.append('Day', 'today');
    
    if (suburb) {
      params.append('Suburb', suburb);
      params.append('Surrounding', 'yes');
    } else if (region) {
      params.append('Region', region.toString());
    }

    const url = `${FUELWATCH_BASE_URL}?${params.toString()}`;
    console.log(`[FuelWatch] Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Perth-Saver-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`FuelWatch API error: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = await parseStringPromise(xmlText, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const channel = result?.rss?.channel;
    if (!channel) {
      throw new Error('Invalid RSS response structure');
    }

    // Parse items from RSS feed
    let items = channel.item;
    if (!items) {
      return {
        stations: [],
        lastUpdated: new Date().toISOString(),
        fuelType: getFuelTypeName(fuelType),
      };
    }

    // Ensure items is an array
    if (!Array.isArray(items)) {
      items = [items];
    }

    const stations: FuelStation[] = items.map((item: any) => ({
      tradingName: item['trading-name'] || item.title?.split(': ')[1] || 'Unknown',
      brand: item.brand || 'Unknown',
      address: item.address || '',
      suburb: item.location || '',
      phone: item.phone || '',
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      price: item.price || '0',
      date: item.date || new Date().toISOString().split('T')[0],
      siteFeatures: item['site-features'] || '',
    }));

    // Sort by price
    stations.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const fuelWatchResponse: FuelWatchResponse = {
      stations,
      lastUpdated: new Date().toISOString(),
      fuelType: getFuelTypeName(fuelType),
    };

    // Update cache with the correct key
    priceCache.set(cacheKey, {
      data: fuelWatchResponse,
      timestamp: now,
    });

    console.log(`[FuelWatch] Fetched ${stations.length} stations for ${getFuelTypeName(fuelType)}`);
    return fuelWatchResponse;
  } catch (error) {
    console.error('[FuelWatch] Error fetching prices:', error);
    
    // Return cached data if available, even if expired
    const staleCache = priceCache.get(cacheKey);
    if (staleCache) {
      console.log('[FuelWatch] Returning stale cache due to error');
      return staleCache.data;
    }
    
    throw error;
  }
}

function getFuelTypeName(fuelType: number): string {
  switch (fuelType) {
    case FUEL_TYPES.ULP: return 'Unleaded (ULP 91)';
    case FUEL_TYPES.PULP: return 'Premium Unleaded (95)';
    case FUEL_TYPES.DIESEL: return 'Diesel';
    case FUEL_TYPES.LPG: return 'LPG';
    case FUEL_TYPES.RON98: return 'Premium (98 RON)';
    case FUEL_TYPES.E85: return 'E85';
    case FUEL_TYPES.BRAND_DIESEL: return 'Brand Diesel';
    default: return 'Unknown';
  }
}

// Get suburbs list for autocomplete
export async function getSuburbs(): Promise<string[]> {
  try {
    const response = await fetch('https://www.fuelwatch.wa.gov.au/api/sites/suburbs');
    if (!response.ok) {
      throw new Error('Failed to fetch suburbs');
    }
    const data = await response.json();
    return data.suburbs || [];
  } catch (error) {
    console.error('[FuelWatch] Error fetching suburbs:', error);
    // Return common Perth suburbs as fallback
    return [
      'Perth', 'Fremantle', 'Joondalup', 'Rockingham', 'Mandurah',
      'Midland', 'Armadale', 'Scarborough', 'Subiaco', 'Victoria Park',
      'Morley', 'Cannington', 'Cockburn', 'Wanneroo', 'Stirling',
    ];
  }
}
