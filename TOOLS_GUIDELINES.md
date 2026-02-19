# Guidelines for Adding New Tools ( calculators )

Use this document when adding a new calculator to the Trend Calculators SEO Suite on jumpstartscaling.com.

---

## 1. Prerequisites

- **Stack:** Astro + React, Tailwind, Recharts (charts), `glass-card` styling
- **Constraint:** Static formulas + user inputs only; no paid APIs
- **Target:** SEO pages tied to LinkedIn/news themes

---

## 2. File Additions Required

| Step | Path | Purpose |
|------|------|---------|
| 1 | `src/content/tools/{slug}.mdx` | Content: frontmatter + MDX sections |
| 2 | `src/components/tools/{Name}Calculator.tsx` | React calculator component |
| 3 | `src/lib/tools-registry.ts` | Add slug → component mapping |
| 4 | Hub + sitemap | Auto-included via content collection |
| 5 | `scripts/submit-indexnow.mjs` | Add slug to `TOOL_SLUGS` array |

---

## 3. Content Collection Frontmatter Schema

Every new tool MDX file must include:

```yaml
---
title: "Tool Display Name"
description: "One-line summary. Keep under 160 chars for meta."
category: "finance" | "ecommerce" | "loyalty" | "labor" | "ai"
emoji: "🚀"
newsHook: "News peg — what headline inspired this? One sentence."
meta:
  title: "SEO Title — Primary Keyword (2026)"
  description: "150–160 chars, keyword-rich, benefit-focused."
  publishedAt: "YYYY-MM-DD"
  updatedAt: "YYYY-MM-DD"
faqs:
  - q: "Question in search-query form"
    a: "Direct, scannable answer."
howToSteps:
  - name: "Step 1 title"
    text: "What the user does."
applicationCategory: "FinanceApplication"  # or appropriate
featureList: ["Feature 1", "Feature 2"]
relatedSlugs:
  - other-tool-slug-1
  - other-tool-slug-2
  - other-tool-slug-3
---
```

---

## 4. MDX Body Structure (~2000 words per page)

Use these sections in order. Wrap each in `<section id="..." class="section light|dark py-16 scroll-mt-24">` for sticky nav.

| Section | Class | Target Words | Content |
|---------|-------|--------------|---------|
| How We Calculate | `light` | 300–400 | Formulas, assumptions, formula callout (glass-card), search hooks |
| News Context | `dark` | 250–350 | News story, KeyFactsGrid (3 glass cards), bold numbers |
| Interpret Results | `light` | 300–400 | BenchmarkTable, ranges, takeaways |
| Who Should Use | `dark` | 200–300 | Bullet list, scenarios, CTA hint |

**MDX gotchas:**
- Avoid `~` inside table cells (MDX may parse as strikethrough) — use "approx." instead
- Use "Under X" instead of `&lt;X` for "less than" in tables to avoid tag parsing
- Ensure `text-[#hex]` classes have closing `]` before `"` (e.g. `text-[#B38728]"` will break)

**Styling:**
- Use `glass-card p-6` for formula callouts and key fact grids
- Use `<table>` in `glass-card` for benchmark tables
- Bold key terms and numbers: `**$100B**`
- Question-style H3s for SEO: "How is X calculated?"
- Short paragraphs (15–25 words), varied length

---

## 5. Calculator Component (React)

- Use `client:visible` for hydration
- Inputs: sliders, number inputs, selects — with min/max and sensible defaults
- Real-time recalc (no submit button)
- Outputs: result cards, Recharts (line/bar/area), tables
- Styling: `glass-card`, `gradient-text`, `text-accent` where appropriate
- Register in `tools-registry.ts`:
  ```ts
  'your-slug': () => import('../components/tools/YourCalculator.tsx'),
  ```

---

## 6. SEO Checklist (Per Page)

- [ ] Unique `<title>` 50–60 chars
- [ ] Unique `<meta description>` 150–160 chars
- [ ] Canonical URL set
- [ ] FAQs in frontmatter (3–5) for FAQPage schema
- [ ] `howToSteps` for HowTo schema
- [ ] `relatedSlugs` (3–4 tools)
- [ ] H1 = primary keyword (in layout)
- [ ] One H1, logical H2/H3 hierarchy
- [ ] Add slug to IndexNow script for fast indexing

---

## 7. Route & URL

- **URL:** `/tools/{slug}`
- **Slug:** lowercase, hyphens, e.g. `startup-valuation-calculator`
- **Content file:** `src/content/tools/{slug}.mdx`

---

## 8. Categories

| ID | Label |
|----|-------|
| finance | Finance & Valuation |
| ecommerce | E-Commerce & Retail |
| loyalty | Loyalty & Travel |
| labor | Labor & Economics |
| ai | AI & Tech |

---

## 9. IndexNow (Fast Indexing)

After adding a new tool, add its slug to `scripts/submit-indexnow.mjs` in the `TOOL_SLUGS` array. The postbuild script will submit it on deploy.

---

## 10. Validation

- Run `npm run build` — no errors
- Check `/tools` hub shows the new card
- Visit `/tools/{slug}` — calculator loads, content renders
- Validate schema at [validator.schema.org](https://validator.schema.org)
- Test Google Rich Results for FAQPage, HowTo

---

## Example: Adding "Crypto Portfolio Simulator"

1. Create `src/content/tools/crypto-portfolio-simulator.mdx` with full frontmatter and MDX sections
2. Create `src/components/tools/CryptoPortfolioSimulator.tsx` (React)
3. Add `'crypto-portfolio-simulator': () => import(...)` to `tools-registry.ts`
4. Add `'crypto-portfolio-simulator'` to `TOOL_SLUGS` in `submit-indexnow.mjs`
5. Build and deploy — new tool appears in hub and sitemap
