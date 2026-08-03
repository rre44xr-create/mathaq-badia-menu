/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const protectsAdminPage = url.pathname.startsWith("/admin");
    const protectsMenuMutation =
      url.pathname.startsWith("/api/menu") && request.method !== "GET";

    if (protectsAdminPage || protectsMenuMutation) {
      const expectedUsername = env.ADMIN_USERNAME || "admin";
      const expectedPassword = env.ADMIN_PASSWORD || "";
      const credentials = readBasicCredentials(request.headers.get("authorization"));

      if (
        !expectedPassword ||
        !credentials ||
        !constantTimeEqual(credentials.username, expectedUsername) ||
        !constantTimeEqual(credentials.password, expectedPassword)
      ) {
        return new Response("يلزم تسجيل الدخول إلى لوحة المطعم", {
          status: 401,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "WWW-Authenticate": 'Basic realm="Mathaq Badia Admin", charset="UTF-8"',
          },
        });
      }

      const authenticatedHeaders = new Headers(request.headers);
      authenticatedHeaders.set("x-mathaq-admin", "1");
      authenticatedHeaders.set("x-mathaq-admin-name", credentials.username);
      request = new Request(request, { headers: authenticatedHeaders });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;

function readBasicCredentials(value: string | null) {
  if (!value?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(value.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function constantTimeEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}
