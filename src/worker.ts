interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const BACKEND_ORIGIN = 'http://jobayer-portfolio-api.runasp.net';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Proxy backend API and uploaded static files to MonsterASP HTTP backend
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/health/')) {
      const targetUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', 'jobayer-portfolio-api.runasp.net');
      forwardHeaders.set('X-Forwarded-Host', url.host);
      forwardHeaders.set('X-Forwarded-Proto', 'https');

      const backendRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: forwardHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual',
      });

      try {
        const response = await fetch(backendRequest);
        return response;
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            error: 'Failed to communicate with backend API',
            details: err?.message || String(err),
          }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Serve Angular static SPA assets for all other routes
    return env.ASSETS.fetch(request);
  },
};
