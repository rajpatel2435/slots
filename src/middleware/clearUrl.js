import { Middleware } from 'astro/middleware';

export async function clearUrl({ request, response }) {
  const { pathname } = new URL(request.url);

  // Clear the URL by redirecting to the root path
  if (pathname !== '/') {
    return response.redirect('/');
  }

  return response;
}