// Cloudflare Worker proxy for the Fair Work Commission Modern Awards Pay Database API.
// Keep your API key in a Cloudflare Worker secret named FWC_API_KEY.
// Do not put the key in index.html or commit it to GitHub.

const FWC_BASE = 'https://api.fwc.gov.au';
const ALLOWED_PATH_PREFIX = '/api/v1/';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    if (!env.FWC_API_KEY) {
      return new Response('Missing Cloudflare secret: FWC_API_KEY', { status: 500, headers: cors });
    }

    const incomingUrl = new URL(request.url);
    if (!incomingUrl.pathname.startsWith(ALLOWED_PATH_PREFIX)) {
      return new Response('Path not allowed', { status: 403, headers: cors });
    }

    const targetUrl = new URL(FWC_BASE + incomingUrl.pathname);
    incomingUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    const upstream = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': env.FWC_API_KEY
      }
    });

    const body = await upstream.text();
    const headers = {
      ...cors,
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json; charset=utf-8'
    };

    return new Response(body, { status: upstream.status, headers });
  }
};
