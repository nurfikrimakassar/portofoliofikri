import Image from "next/image";

export default function ImageSlot({
  url,
  alt,
  placeholder = "Gambar",
  fit = "cover",
  className = "",
  style,
}: {
  url?: string;
  alt: string;
  placeholder?: string;
  fit?: "cover" | "contain";
  className?: string;
  style?: React.CSSProperties;
}) {
  if (url) {
    return (
      <div className={`relative overflow-hidden border border-white/12 ${className}`} style={style}>
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1080px"
          style={{ objectFit: fit }}
        />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-white/15 bg-white/[0.02] font-mono text-[12px] text-center px-4 ${className}`}
      style={{ color: "#525252", ...style }}
    >
      {placeholder}
    </div>
  );
}
