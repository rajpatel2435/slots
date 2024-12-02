import { seoNodeByURI } from './seo';

export async function getSeoData(Astro) {
  // Get the full URL from Astro.request.url
  const fullUrl = Astro.request.url;

  // Extract the path from the URL
  const path = new URL(fullUrl).pathname;

  // Set the URI based on the path
  const uri = path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;

  // Fetch the SEO data
  const data = await seoNodeByURI(uri);




  // Extract the relevant SEO data
  const node = data.nodeByUri && data.nodeByUri.seo ? data.nodeByUri : null;
  const seo = node ? node.seo : null;

  return seo;
}
