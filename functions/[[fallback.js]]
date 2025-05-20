/**
 * Cloudflare Pages Function: smart SPA fallbacks for
 *  - /admin   (React app)
 *  - /student (React app)
 *  - /intake  (alias of admin)
 *  - root landing page
 */
export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  /* 1 Try to serve the file directly (fast‑path). */
  const response = await next();
  if (response.status !== 404) return response;   // asset exists, done

  /* 2  Choose which index.html to serve. */
  if (url.pathname.startsWith('/admin')) {
    return fetch('/admin/index.html', request);
  }
  if (url.pathname.startsWith('/student')) {
    return fetch('/student/index.html', request);
  }
  if (url.pathname.startsWith('/intake')) {
    return fetch('/admin/index.html', request);   // intake shares admin code
  }

  /* 3  Default root SPA (landing page) */
  return fetch('/index.html', request);
}
