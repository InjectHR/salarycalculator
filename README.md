# Pay Calculator - Stage 2.1 API Proxy Version

This version fixes the browser `Failed to fetch` problem by routing Fair Work API calls through a Cloudflare Worker proxy.

## Files

- `index.html` - upload this to GitHub Pages after setting your Worker URL inside the CONFIG block.
- `cloudflare-worker.js` - deploy this as a Cloudflare Worker.

## Why this version is needed

A static GitHub Pages site runs in the user's browser. Many APIs block direct browser requests with CORS settings. The proxy calls the Fair Work API server-to-server and returns the data to the browser with the correct CORS headers.

## Cloudflare Worker setup

1. Create or log into a Cloudflare account.
2. Go to Workers & Pages.
3. Create a new Worker.
4. Replace the Worker code with `cloudflare-worker.js`.
5. In the Worker settings, add a secret/environment variable:
   - Name: `FWC_API_KEY`
   - Value: your Fair Work API key
6. Deploy the Worker.
7. Copy the Worker URL. It will look similar to:
   `https://your-worker-name.your-subdomain.workers.dev`
8. Open `index.html` and find:
   `API_PROXY_BASE: 'PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE'`
9. Replace the placeholder with your Worker URL.
10. Upload the updated `index.html` to GitHub Pages.

## Security note

If your previous `index.html` containing the API key was uploaded to a public GitHub repository, rotate/regenerate the key if possible.
