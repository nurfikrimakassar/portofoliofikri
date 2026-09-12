import { GraphicContentBlock, GraphicDetail } from "./types";

/**
 * Older graphic entries stored their story as a single `imageNote` paragraph
 * plus a separate `galleryRows` list. New entries use one ordered `content`
 * array so photos and paragraphs can be reordered together. This turns the
 * old shape into the new one (used both for rendering and as the base an
 * admin edit applies on top of, so nothing is lost the first time an old
 * item is touched).
 */
export function migrateGraphicContent(detail: GraphicDetail): GraphicContentBlock[] {
  if (detail.content?.length) return detail.content;
  const blocks: GraphicContentBlock[] = [];
  if (detail.imageNote) {
    blocks.push({ id: "migrated-text", type: "text", text: detail.imageNote });
  }
  (detail.galleryRows || []).forEach((row, i) => {
    blocks.push({ id: row.id || `migrated-row-${i}`, type: "row", images: row.images });
  });
  return blocks;
}
