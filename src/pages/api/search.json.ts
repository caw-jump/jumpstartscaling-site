import { pseoContent } from '../../utils/pseo';

export async function GET() {
  // We only send the metadata to the client to keep the payload < 1MB
  // If we send the full text blocks for 3,700 pages, the browser will crash.
  const searchIndex = pseoContent.map(entry => ({
    title: entry.title,
    slug: entry.slug,
    headline: entry.headline,
    category: entry.category,
    city: entry.city,
    state: entry.state
  }));

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
