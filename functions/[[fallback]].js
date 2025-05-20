/**
 * Cloudflare Pages Function: smart SPA fallbacks for
 *  - /admin   (React app)
 *  - /student (React app)
 *  - /intake  (alias of admin)
 *  - root landing page
 */
export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // 1 Serve the asset if it exists
  const response = await next();
  if (response.status !== 404) return response;

  // 2 Route‑based SPA fallbacks
  if (url.pathname.startsWith('/admin') || url.pathname === '/login') {
    // /login should load the admin bundle (it will show the login screen inside React)
    return fetch('/admin/index.html', request);
  }
  if (url.pathname.startsWith('/student')) {
    return fetch('/student/index.html', request);
  }
  if (url.pathname.startsWith('/intake')) {
    // keep using the admin bundle – React route /intake will embed your Tally form
    return fetch('/admin/index.html', request);
  }

  // 3 Default landing page
  return fetch('/index.html', request);
}

