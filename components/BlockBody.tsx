import { Block } from "@/lib/types";
import ImageSlot from "./ImageSlot";

export default function BlockBody({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((blk) => {
        if (blk.type === "heading") {
          return (
            <h2
              key={blk.id}
              className="text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.01em] text-[#f5f5f5] mt-4"
            >
              {blk.text}
            </h2>
          );
        }
        if (blk.type === "quote") {
          return (
            <blockquote
              key={blk.id}
              className="border-l-2 border-[#f5f5f5] py-1 pl-6 text-[clamp(20px,2.4vw,26px)] font-medium text-[#f5f5f5] tracking-[-0.01em] leading-[1.4]"
            >
              {blk.text}
            </blockquote>
          );
        }
        if (blk.type === "image") {
          return (
            <figure key={blk.id} className="my-2">
              <ImageSlot
                url={blk.url}
                alt={blk.cap || "Gambar"}
                placeholder="Gambar"
                fit="cover"
                className="block w-full aspect-video"
              />
              {blk.cap && (
                <figcaption className="font-mono text-[11.5px] text-[#525252] mt-3">{blk.cap}</figcaption>
              )}
            </figure>
          );
        }
        return (
          <p key={blk.id} className="text-balance-pretty">
            {blk.text}
          </p>
        );
      })}
    </>
  );
}
