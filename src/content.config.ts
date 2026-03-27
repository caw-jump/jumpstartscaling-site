import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const metaSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const faqSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const howToStepSchema = z.object({
  name: z.string(),
  text: z.string(),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    category: z.enum([
      'finance',
      'ecommerce',
      'loyalty',
      'labor',
      'ai',
      'trading',
      'marketing',
      'saas',
      'real-estate',
      'home-services',
      'rentals',
    ]),
    emoji: z.string().default('📊'),
    newsHook: z.string().optional(),
    meta: metaSchema.optional(),
    faqs: z.array(faqSchema).optional(),
    howToSteps: z.array(howToStepSchema).optional(),
    applicationCategory: z.string().optional(),
    featureList: z.array(z.string()).optional(),
    relatedSlugs: z.array(z.string()).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    palette: z.enum(['gold', 'emerald', 'sapphire']).default('gold'),
    publishedAt: z.string().optional(),
    author: z.string().default('Jumpstart Scaling'),
    keyMetrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    order: z.number().optional(),
    faqs: z.array(faqSchema).optional(),
  }),
});

const intel = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/intel' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    palette: z.enum(['gold', 'emerald', 'sapphire']).default('emerald'),
    publishedAt: z.string(),
    author: z.string().default('Jumpstart Scaling'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { services, intel, tools };
