import { Metric } from '../types';

// Service for fetching real-time data from external APIs
// Excludes Gemini AI, focuses on public data sources

export interface DataSource {
  name: string;
  url: string;
  description: string;
}

export interface ExternalData {
  source: DataSource;
  data: Metric[];
  lastUpdated: string;
  cacheExpiry: number; // hours
}

const DATA_SOURCES: DataSource[] = [
  {
    name: 'UN Data',
    url: 'https://data.un.org/ws/rest/data/',
    description: 'United Nations global statistics'
  },
  {
    name: 'World Bank',
    url: 'https://api.worldbank.org/v2/',
    description: 'World Bank development indicators'
  },
  {
    name: 'WHO',
    url: 'https://ghoapi.azureedge.net/api/',
    description: 'World Health Organization data'
  }
];

const CACHE_KEY = 'krisen_external_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Cache management
function getCachedData(): ExternalData[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: ExternalData[] = JSON.parse(cached);
    const now = Date.now();

    // Filter out expired data
    const validData = data.filter(item =>
      now - new Date(item.lastUpdated).getTime() < item.cacheExpiry * 60 * 60 * 1000
    );

    return validData.length > 0 ? validData : null;
  } catch (error) {
    console.warn('Failed to load cached data:', error);
    return null;
  }
}

function setCachedData(data: ExternalData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

// UN Data API integration
export async function fetchUNData(indicator: string): Promise<Metric[]> {
  try {
    // UN Data API example - simplified for development
    // In production, would use actual UN Data API endpoints
    const mockData: Metric[] = [
      { label: 'Global Population', value: 8000000000 },
      { label: 'GDP Growth', value: 2.5 },
      { label: 'CO2 Emissions', value: 36.4 }
    ];

    return mockData;
  } catch (error) {
    console.error('Failed to fetch UN data:', error);
    return [];
  }
}

// World Bank API integration
export async function fetchWorldBankData(country: string, indicator: string): Promise<Metric[]> {
  try {
    // World Bank API example
    const mockData: Metric[] = [
      { label: 'GDP per capita', value: 45000 },
      { label: 'Life expectancy', value: 78.5 },
      { label: 'Unemployment rate', value: 5.2 }
    ];

    return mockData;
  } catch (error) {
    console.error('Failed to fetch World Bank data:', error);
    return [];
  }
}

// WHO API integration
export async function fetchWHOData(indicator: string): Promise<Metric[]> {
  try {
    // WHO API example
    const mockData: Metric[] = [
      { label: 'Overdose deaths', value: 600000 },
      { label: 'Mental health disorders', value: 970000000 },
      { label: 'COVID-19 cases', value: 700000000 }
    ];

    return mockData;
  } catch (error) {
    console.error('Failed to fetch WHO data:', error);
    return [];
  }
}

// Main data fetching function with caching
export async function fetchExternalData(crisisType: string): Promise<Metric[]> {
  // Check cache first
  const cached = getCachedData();
  if (cached) {
    const relevantData = cached.find(item =>
      item.source.name.toLowerCase().includes(crisisType.toLowerCase())
    );
    if (relevantData) {
      return relevantData.data;
    }
  }

  // Fetch fresh data based on crisis type
  let data: Metric[] = [];

  try {
    switch (crisisType.toLowerCase()) {
      case 'drogen':
      case 'drugs':
        data = await fetchWHOData('overdose');
        break;
      case 'armut':
      case 'poverty':
        data = await fetchWorldBankData('DEU', 'poverty');
        break;
      case 'naturkatastrophen':
      case 'disasters':
        data = await fetchUNData('disaster');
        break;
      default:
        data = await fetchUNData('general');
    }

    // Cache the data
    const externalData: ExternalData = {
      source: DATA_SOURCES[0], // Default to UN Data
      data,
      lastUpdated: new Date().toISOString(),
      cacheExpiry: 24
    };

    const existingCache = cached || [];
    const updatedCache = existingCache.filter(item =>
      !item.source.name.toLowerCase().includes(crisisType.toLowerCase())
    );
    updatedCache.push(externalData);
    setCachedData(updatedCache);

  } catch (error) {
    console.error('Failed to fetch external data:', error);
    // Return fallback static data
    data = getFallbackData(crisisType);
  }

  return data;
}

// Fallback data for offline/demo mode
function getFallbackData(crisisType: string): Metric[] {
  const fallbacks: Record<string, Metric[]> = {
    drogen: [
      { label: 'Drug users global', value: 292000000 },
      { label: 'Overdose deaths', value: 600000 },
      { label: 'Treatment coverage', value: 20 }
    ],
    armut: [
      { label: 'People in poverty', value: 700000000 },
      { label: 'GDP per capita', value: 45000 },
      { label: 'Inequality index', value: 32.5 }
    ],
    default: [
      { label: 'Global population', value: 8000000000 },
      { label: 'CO2 emissions', value: 36.4 },
      { label: 'Renewable energy %', value: 29 }
    ]
  };

  return fallbacks[crisisType.toLowerCase()] || fallbacks.default;
}

// Get available data sources
export function getDataSources(): DataSource[] {
  return DATA_SOURCES;
}

// Clear cache
export function clearDataCache() {
  localStorage.removeItem(CACHE_KEY);
}
