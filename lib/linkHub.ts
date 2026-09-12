import { LinkHubGroup } from "./types";

export const LINK_HUB_HOST = "portofolio.nurfikri.com";

/** "Anak Teknik Indo" -> "anakteknikindo" — no manual slug field, the URL
 * segment always follows the group's name automatically. */
function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "") || "group";
}

/** The slug for groups[index], de-duplicated against earlier groups that
 * would otherwise produce the same slug (2nd "Happy Kamper" -> happykamper-2). */
export function groupSlug(groups: LinkHubGroup[], index: number): string {
  const base = slugifyTitle(groups[index]?.title || "");
  let count = 0;
  for (let i = 0; i < index; i++) {
    if (slugifyTitle(groups[i].title) === base) count++;
  }
  return count === 0 ? base : `${base}-${count + 1}`;
}

/** Find a group by its (derived) slug. */
export function findGroupBySlug(groups: LinkHubGroup[], slug: string): LinkHubGroup | undefined {
  return groups.find((_, i) => groupSlug(groups, i) === slug);
}
