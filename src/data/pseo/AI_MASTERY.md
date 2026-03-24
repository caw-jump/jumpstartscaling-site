# AI pSEO Master Specification: Jumpstart Scaling

This document is the **Unified Source of Truth** for the Jumpstart Scaling Programmatic SEO (pSEO) ecosystem. It is designed to provide full context for AI agents and developers to maintain, expand, and troubleshoot the 3,700-page matrix engine.

---

## 1. System Overview
The Jumpstart Scaling pSEO engine is a multi-dimensional matrix that generates unique landing pages at build-time using Astro (Static Site Generation).

- **Current Scale**: 74 Metropolitan Markets × 40 Industry Niches ≈ 2,960 Matrix Pages.
- **Legacy Content**: 1,718 fixed JSON pages.
- **Total Index**: ~4,600 unique URLs.
- **Coverage**: 100% of all 50 US States + District of Columbia.

---

## 2. Core Data Architecture
The engine relies on a synchronized set of JSON files located in `src/data/pseo/`:

| File | Purpose | Key Fields |
| :--- | :--- | :--- |
| `locations.json` | Geographic Master List | `city`, `state`, `neighborhood`, `landmarks` (array), `motto`, `parks` (array) |
| `niche_content_matrix.json` | Service/Niche Data | `results_quantified`, `geo_brag`, `pain_points` |
| `avatar_definitions.json` | Persona Mapping | `display_name`, `primary_pain`, `key_metric` |
| `search_intent_matrix.json` | SEO Metadata | `h2_query`, `meta_title`, `meta_description` |
| `synonym_groups.json` | Spintax Dictionary | `grow`, `expert`, `automation`, `private_ai`, `innovation` |

---

## 3. The Spintax Engine (`src/utils/spintaxEngine.ts`)
The engine uses a **Multi-Pass Seeded Random** resolver to ensure high uniqueness and deterministic rendering.

### Recursive Resolution Logic:
1.  **Pass 1 (Direct Placeholders)**: Resolves `{{city}}`, `{{niche_key}}`, etc.
2.  **Pass 2 (Nested Metadata)**: Resolves placeholders inside already-resolved strings (e.g., resolving `{{city}}` inside an `{{intent.meta_title}}`).
3.  **Synonym Injection**: Picks a random term from `synonym_groups.json` (e.g., `%grow%` becomes "skyrocket").
4.  **Structural Spintax**: Resolves standard `{Option A|Option B}` syntax.

### Seeding:
All randomness is seeded by the **URL Slug**. This ensures that the same page always looks identical across re-builds, preventing "content flickering" for search engine crawlers.

---

## 4. UI components & Layouts
- **Registry Index**: `src/pages/local-intel/index.astro` – Hub for all 51 states.
- **State Hubs**: `src/pages/local-intel/[state].astro` – Filtered view of cities within a specific state.
- **Landing Pages**: `src/pages/insights/[...slug].astro` – The primary template for matrix and legacy pages.
- **Search Integration**:
    - **API Endpoint**: `src/pages/api/search.json.ts` – Serves a full index of all ~4,600 pages.
    - **Global Search UI**: `src/components/StickySearchBar.astro` – Premium glassmorphism pill fixed to the bottom.

---

## 5. SEO & Uniqueness Strategy
To maintain a >90% uniqueness score across 3,000+ pages:
1.  **High-Fidelity Metadata**: Injects hyper-local landmarks (e.g., "near The Alamo") and mottos directly into H1s.
2.  **Meta-Title Spintax**: Every niche has 2-3 variations of its meta-title template.
3.  **Ultra-Variety Headlines**: The engine picks from **14 distinct headline templates** per page.

---

## 6. Maintenance Commands
- **Local Dev**: `npm run dev` (runs on port 8100/4321).
- **Git Push**: Changes must be pushed to the `main` branch to trigger the production build at `jumpstartscaling.com`.

---

## 7. Future Expansion
- **New Markets**: Append to `locations.json`.
- **New Services**: Append to `niche_content_matrix.json` and map in `search_intent_matrix.json`.
- **New Synonyms**: Update `synonym_groups.json` to refresh the "flavor" of all 4,000 pages instantly.
