import contentDataRaw from '../data/pseo/jss_content.json';
import locationsDataRaw from '../data/pseo/locations.json';

export interface LocationRecord {
  city: string;
  state: string;
  zip: string;
  slug: string;
}

export interface PseoEntry {
  title: string;
  slug: string;
  blocks: string;
  // Derived fields:
  state: string;
  city: string;
  category: string;
  headline: string;
  excerpt: string;
}

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

// Generate the mapped master dataset
export const pseoContent: PseoEntry[] = (contentDataRaw as any[])
  .filter(item => item.slug && item.slug.startsWith('insights/'))
  .map(item => {
    // Determine category from slug (e.g., insights/crm-automation-revenue-growth/revenue-pipeline-build-columbus-oh)
    const parts = item.slug.split('/');
    const category = parts.length > 2 ? parts[1].replace(/-/g, ' ') : '';
    
    // Attempt to match the last segment of the slug to a location.
    // The slug filename usually ends with `-city-state` like `-columbus-oh`.
    const filename = parts[parts.length - 1] || '';
    
    let state = 'Unknown';
    let city = 'Unknown';
    
    // Sort locations to match largest slugs first ensuring we don't accidentally match substrings loosely
    const sortedLocations = [...locations].sort((a,b) => b.slug.length - a.slug.length);
    for (const loc of sortedLocations) {
      if (filename.endsWith(`-${loc.slug}`)) {
        state = loc.state;
        city = loc.city;
        break;
      }
    }

    return {
      ...item,
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
