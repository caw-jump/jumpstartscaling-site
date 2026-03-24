import locationsDataRaw from '../data/pseo/locations.json';
import { generatePseoPages } from './spintaxEngine';

export interface LocationRecord {
  city: string;
  state: string;
  zip: string;
  slug: string;
}

export interface PseoEntry {
  title: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  headline?: string;
  blocks?: any[];
}

export const STATE_NAME_MAP: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

const locations: LocationRecord[] = locationsDataRaw as any;

// Helper to extract a headline from blocks string
function extractHeadline(blocksStr: string): string {
  try {
    const blocks = JSON.parse(blocksStr);
    const hero = blocks.find((b: any) => b.block_type === 'hero');
    if (hero && hero.data && hero.data.headline) {
      return hero.data.headline;
    }
  } catch(e) {}
  return "Discover Actionable Insights for Revenue Growth";
}

// Generate the fully massive dataset dynamically on demand
const rawContentFromEngine = generatePseoPages();

export const pseoContent: PseoEntry[] = rawContentFromEngine
  .filter((item: any) => item.slug && item.slug.startsWith('insights/'))
  .map((item: any) => {
    const parts = item.slug.split('/');
    
    // We have two slug structures in the dataset:
    // 1. LEGACY: insights/category-name/some-page-name-columbus-oh
    // 2. MATRIX: insights/columbus-oh/roofing-sales-director
    
    let state = 'Unknown';
    let city = 'Unknown';
    let category = '';

    // Sort locations to match largest slugs first ensuring we don't accidentally match substrings loosely
    const sortedLocations = [...locations].sort((a,b) => b.slug.length - a.slug.length);
    
    // Helper to safely strip suffix
    const extractLocationFromLegacySlug = (filename: string) => {
        for (const loc of sortedLocations) {
            if (filename.endsWith(`-${loc.slug}`)) {
                return loc;
            }
        }
        return null;
    };

    if (parts.length === 3) {
      // MATRIX: parts = ['insights', 'columbus-oh', 'roofing-sales-director']
      const possibleLocSlug = parts[1];
      const matchedLoc = sortedLocations.find(loc => loc.slug === possibleLocSlug);
      if (matchedLoc) {
         state = matchedLoc.state;
         city = matchedLoc.city;
         category = parts[2].replace(/-/g, ' '); // Category is the niche name
      } else {
         // Fallback legacy behavior just in case
         const locMatch = extractLocationFromLegacySlug(parts[parts.length - 1] || '');
         if (locMatch) { state = locMatch.state; city = locMatch.city; }
         category = (parts[1] || '').replace(/-/g, ' '); 
      }
    } else {
      // LEGACY: parts > 3 (e.g. ['insights', 'category', 'specific-slug-city'])
      // or standard
      const filename = parts[parts.length - 1] || '';
      const locMatch = extractLocationFromLegacySlug(filename);
      if (locMatch) {
         state = locMatch.state;
         city = locMatch.city;
      }
      category = parts.length > 2 ? parts[1].replace(/-/g, ' ') : '';
    }

    return {
      title: item.title,
      slug: item.slug,
      blocks: item.blocks,
      state,
      city,
      category,
      headline: extractHeadline(item.blocks),
      excerpt: category.charAt(0).toUpperCase() + category.slice(1)
    };
  });

// Group entries by state
export const stateGroupedContent: Record<string, PseoEntry[]> = {};
for (const entry of pseoContent) {
  if (entry.state !== 'Unknown') {
    if (!stateGroupedContent[entry.state]) {
      stateGroupedContent[entry.state] = [];
    }
    stateGroupedContent[entry.state].push(entry);
  }
}

// Top 10 States for specific menus
export const top10States = Object.entries(stateGroupedContent)
  // Sort states by number of published articles (descending)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .map(([stateCode]) => stateCode);
