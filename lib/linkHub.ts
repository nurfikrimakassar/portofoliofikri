import { headers } from "next/headers";

export const LINK_HUB_HOST = "portofolio.nurfikri.com";

/**
 * Internal hub links need a different prefix depending on where the page is
 * actually being served from: "" when the request really came in on
 * portofolio.nurfikri.com (proxy.ts already rewrote the path to /link-hub/...
 * behind the scenes, so a bare "/<slug>" keeps the clean subdomain URL), or
 * "/link-hub" when previewing the same content directly on the main domain
 * (nurfikri.com/link-hub) before the subdomain is set up.
 */
export async function getLinkHubPrefix(): Promise<string> {
  const h = await headers();
  const host = h.get("host") || "";
  return host === LINK_HUB_HOST ? "" : "/link-hub";
}
