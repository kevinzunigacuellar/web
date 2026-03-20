const MARKDOWN_ACCEPT_TYPES = [
  "text/markdown",
  "text/x-markdown",
  "application/markdown",
  "text/plain",
];

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

function wantsMarkdown(request: Request): boolean {
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return MARKDOWN_ACCEPT_TYPES.some((type) => accept.includes(type));
}

function isNegotiableMethod(method: string): boolean {
  return method === "GET" || method === "HEAD";
}

function markdownPathname(pathname: string): string | null {
  if (pathname === "/") {
    return "/index.md";
  }

  if (pathname.endsWith("/")) {
    return `${pathname}index.md`;
  }

  if (pathname.endsWith(".html")) {
    return pathname.replace(/\.html$/i, ".md");
  }

  if (!pathname.includes(".", pathname.lastIndexOf("/") + 1)) {
    return `${pathname}.md`;
  }

  return null;
}

function withVaryAccept(headers: Headers): Headers {
  const vary = headers.get("vary");
  if (!vary) {
    headers.set("vary", "Accept");
    return headers;
  }

  if (!vary.toLowerCase().split(",").map((part) => part.trim()).includes("accept")) {
    headers.set("vary", `${vary}, Accept`);
  }

  return headers;
}

function responseWithHeaders(response: Response, headers: Headers): Response {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function fetchAsset(env: Env, request: Request, pathname: string): Promise<Response> {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!isNegotiableMethod(request.method)) {
      return env.ASSETS.fetch(request);
    }

    if (!wantsMarkdown(request)) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    const markdownPath = markdownPathname(url.pathname);

    if (!markdownPath) {
      return env.ASSETS.fetch(request);
    }

    const markdownResponse = await fetchAsset(env, request, markdownPath);

    if (markdownResponse.ok) {
      const headers = withVaryAccept(new Headers(markdownResponse.headers));
      headers.set("content-type", MARKDOWN_CONTENT_TYPE);
      return responseWithHeaders(markdownResponse, headers);
    }

    const htmlResponse = await env.ASSETS.fetch(request);
    const headers = withVaryAccept(new Headers(htmlResponse.headers));
    return responseWithHeaders(htmlResponse, headers);
  },
} satisfies ExportedHandler<Env>;
