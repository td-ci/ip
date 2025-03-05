/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const ipCandidates = [
      request.headers.get('cf-connecting-ip'),
      request.headers.get('x-real-ip'),
      ...(request.headers.get('x-forwarded-for')?.split(',') ?? []),
    ]
    const ip = ipCandidates.filter((ip) => !!ip)[0]
    if (!ip) {
      return new Response('No IP found', { status: 500 })
    }

    // noinspection SpellCheckingInspection
    const country = request.headers.get('cf-ipcountry')
    const response = {
      ip,
      country,
    }
    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'content-type': 'application/json',
        },
      });
  },
} satisfies ExportedHandler<Env>;
