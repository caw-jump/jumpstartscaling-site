import locationsRaw from '../data/pseo/locations.json';
import nicheMatrixRaw from '../data/pseo/niche_content_matrix.json';
import avatarDefsRaw from '../data/pseo/avatar_definitions.json';
import intentMatrixRaw from '../data/pseo/search_intent_matrix.json';
import jssContentRaw from '../data/pseo/jss_content.json';
import offerBlocksRaw from '../data/pseo/offer_blocks.json';
import synonymGroupsRaw from '../data/pseo/synonym_groups.json';
import sharedSpintaxRaw from '../data/pseo/globals/shared_spintax.json';

// Type definitions
const locations = locationsRaw as any[];
const nicheMatrix = (nicheMatrixRaw as any).matrix;
const avatarDefs = (avatarDefsRaw as any).avatars;
const intentMatrix = (intentMatrixRaw as any).intent_data;
const existingPages = jssContentRaw as any[];
const offerBlocks = offerBlocksRaw as any[];

// Merge local and shared spintax
const sharedSynonyms = (sharedSpintaxRaw as any).synonyms || [];
const synonymGroups = [...(synonymGroupsRaw as any[]), ...sharedSynonyms];

/**
 * Deterministic Seeded Random
 * Ensures the SAME city/niche always gets the SAME spin.
 */
function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0; 
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

/**
 * Advanced Spintax Resolver
 * 1. Handles {Option A|Option B}
 * 2. Handles %synonym_category%
 * 3. Handles {{placeholders}}
 */
function resolveSpintax(text: string, seed: string, context: any) {
    if (!text) return '';
    let res = text;
    let rngOffset = 0;

    const getRng = () => seededRandom(seed + (rngOffset++));

    // 1. Resolve {{placeholders}} (Two passes for nested placeholders like {{intent.meta_title}} which contains {{city}})
    const resolvePlaceholders = (val: string) => {
        let t = val;
        // Pass 1
        Object.keys(context).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
            t = t.replace(regex, context[key]);
        });
        // Pass 2 (for nested)
        Object.keys(context).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
            t = t.replace(regex, context[key]);
        });
        return t;
    };

    res = resolvePlaceholders(res);

    // 2. Resolve %synonyms% from synonym_groups.json
    synonymGroups.forEach(group => {
        const regex = new RegExp(`%${group.category}%`, 'g');
        if (res.includes(`%${group.category}%`)) {
            const terms = JSON.parse(group.terms);
            res = res.replace(regex, () => {
                const picked = terms[Math.floor(getRng() * terms.length)];
                // Resolve placeholders if they exist inside the synonym term
                return resolvePlaceholders(picked);
            });
        }
    });

    // 3. Resolve Structural Spintax {A|B|C}
    const spintaxRegex = /\{([^{}]+)\}/g;
    while (spintaxRegex.test(res)) {
        res = res.replace(spintaxRegex, (_, options) => {
            const choices = options.split('|');
            return choices[Math.floor(getRng() * choices.length)];
        });
    }

    return res;
}

export function generatePseoPages() {
  const allPages = [];
  
  for (const page of existingPages) {
    if (!page.slug || !page.slug.startsWith('insights/')) continue;
    allPages.push(page);
  }

  const niches = Object.keys(nicheMatrix);

  for (const loc of locations) {
    if (!loc.city || !loc.state) continue;

    for (const nicheKey of niches) {
        const niche = nicheMatrix[nicheKey];
        const avatar = avatarDefs[nicheKey];
        const intent = intentMatrix[nicheKey];
        if (!niche || !avatar || !intent) continue;

        const locSlug = loc.slug;
        const nicheSlug = nicheKey.replace(/_/g, '-');
        const urlSlug = `insights/${locSlug}/${nicheSlug}`;
        
        // Seed based on slug for consistency
        const spin = (t: string) => {
            // Helper to get a random item from an array if it exists
            const getRand = (arr: any[]) => arr && Array.isArray(arr) ? arr[Math.floor(seededRandom(urlSlug) * arr.length)] : arr;

            return resolveSpintax(t, urlSlug, {
                // Geo Data
                city: loc.city,
                state: loc.state,
                neighborhood: loc.neighborhood || loc.city,
                county: loc.county || `${loc.city} Area`,
                landmark: getRand(loc.landmarks) || "Downtown",
                parks: getRand(loc.parks) || "Public Parks",
                motto: loc.motto || "Success",
                zip: loc.zip || "",
                // Niche/Avatar Data
                niche_key: avatar.display_name,
                results_quantified: niche.results_quantified,
                geo_brag: niche.geo_brag,
                primary_pain: avatar.primary_pain,
                // Intent Data
                "intent.h2_query": intent.h2_query,
                "intent.meta_title": intent.meta_title,
                "intent.meta_description": intent.meta_description
            });
        };

        const randomOffer = offerBlocks[Math.floor(seededRandom(urlSlug) * offerBlocks.length)];
        let offerData: any = typeof randomOffer.data === 'string' ? JSON.parse(randomOffer.data) : randomOffer.data;

        // HIGH UNIQUENESS HEADLINE TEMPLATES (14+ variations)
        const headlineTemplates = [
            `{Stop|Ditch|End} %zapier% and %grow% with %automation% in {{city}}`,
            `{{intent.h2_query}}`, 
            `How {{city}} %expert% {{niche_key}}s are using %ai% to %grow%`,
            `The %private_ai% %architecture% built for {{city}} %expert% operations`,
            `%headless% %expert% {{niche_key}} %automation% {live|deployed} in {{neighborhood}}`,
            `Why {{city}} %expert% {{niche_key}}s are {moving|switching} to %custom_saas% near {{landmark}}`,
            `{{motto}}: The spirit of {{city}} %expert% %innovation%`,
            `{Scaling|Growing} {{niche_key}} %revenue% across {{county}} with %private_ai%`,
            `The {{neighborhood}} %expert% playbook for {{niche_key}} %innovation%`,
            `{Native|Zero-touch} %automation% for {{city}} %expert% {{niche_key}}s near {{parks}}`,
            `{%private_ai%|%custom_saas%}: Built for {{city}} %expert% firms in {{county}}`,
            `How {{city}} {{niche_key}}s are using %headless% tech to %grow% near {{landmark}}`,
            `{{motto}}: Powering the {{city}} %expert% {{niche_key}} %pipeline%`,
            `Building the %architecture% of the future for {{neighborhood}} {{niche_key}}s`
        ];
        
        const selectedTemplate = headlineTemplates[Math.floor(seededRandom(urlSlug + 'head_v2') * headlineTemplates.length)];
        const headline = spin(selectedTemplate);

        const blocks = [
            {
                block_type: 'hero',
                data: {
                    badge: spin(`{Exclusive|Verified|Local} {{niche_key}} %automation%`),
                    headline: headline,
                    subhead: spin(`{Finally,|Real talk:|} **{{primary_pain}}** We %fast% deploy %private_ai% %software% built for {{niche_key}}s in {{city}} to %grow% %revenue%.`),
                    cta_label: spin(offerData.button_text || `{Start|Claim} {{city}} %audit%`),
                    cta_href: "#audit",
                    warning_text: spin(`{Zero-touch|Native|Serverless} %headless% deployment %fast% available in {{county}}.`)
                }
            },
            {
                block_type: 'value_prop',
                data: {
                    title: spin(`{{geo_brag}}`),
                    body: spin(`### The %expert% Problem in {{city}}\n{{primary_pain}}\n\n### The %automation% %architecture%\n{{results_quantified}}\n\nWe build the moats—%private_ai% %automation%, %headless% %software%, and %pipeline% %automation%—that %fast% %grow% your %revenue% in {{state}}.`)
                }
            },
            {
                block_type: 'cta',
                data: {
                    heading: spin(offerData.headline),
                    text: spin(`{Stop|Tired of} using generic %software%? Get a %custom_saas% %architecture% %fast%.`),
                    label: spin(offerData.button_text || "Get Started"),
                    href: "#audit"
                }
            },
            {
                block_type: 'audit_form',
                data: {
                    title: spin(`{Claim|Book} your {{niche_key}} %audit%`),
                    subhead: spin(`{Map out|Architect} your {{neighborhood}} %pipeline% in 15 minutes.`),
                    form_title: spin(offerData.headline || `Confidential %audit%`),
                    submit_source: `Matrix_${nicheKey}`
                }
            }
        ];

        allPages.push({
            title: spin(`{{intent.meta_title}}`),
            slug: urlSlug,
            blocks: JSON.stringify(blocks)
        });
    }
  }

  return allPages;
}
