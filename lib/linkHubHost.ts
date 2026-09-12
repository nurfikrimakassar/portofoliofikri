import "server-only";
import { headers } from "next/headers";
import { LINK_HUB_HOST } from "./linkHub";

/**
 * Internal hub links need a different prefix depending on where the page is
 * actually being served from: "" when the request really came in on
 * portofolio.nurfikri.com (proxy.ts already rewrote the path to /link-hub/...
 * behind the scenes, so a bare "/<slug>" keeps the clean subdomain URL), or
 * "/link-hub" when previewing the same content directly on the main domain
 * (nurfikri.com/link-hub) before the subdomain is set up.
 *
 * Kept in its own file (not lib/linkHub.ts) because it needs next/headers,
 * which can't be pulled into the "use client" admin editor that also needs
 * the plain slug helpers from lib/linkHub.ts.
 */
export async function getLinkHubPrefix(): Promise<string> {
  const h = await headers();
  const host = h.get("host") || "";
  return host === LINK_HUB_HOST ? "" : "/link-hub";
}
