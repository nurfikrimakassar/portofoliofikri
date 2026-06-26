import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  paramName: string;
  currentParams: Record<string, string>;
  basePath: string;
  theme?: "dark" | "light";
};

function buildUrl(
  basePath: string,
  currentParams: Record<string, string>,
  paramName: string,
  page: number
) {
  const params = new URLSearchParams(currentParams);
  if (page <= 1) params.delete(paramName);
  else params.set(paramName, String(page));
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export default function Pagination({
  page,
  totalPages,
  paramName,
  currentParams,
  basePath,
  theme = "dark",
}: Props) {
  if (totalPages <= 1) return null;

  const dark = theme === "dark";
  const dim = dark ? "text-[#525252]" : "text-[#a3a3a3]";
  const active = dark ? "text-[#f5f5f5]" : "text-[#0a0a0a]";
  const border = dark ? "border-white/14" : "border-black/16";
  const hover = dark ? "hover-link" : "hover-link-dark";
  const activeBg = dark ? "bg-white/8" : "bg-black/8";

  const range: number[] = [];
  for (let i = 1; i <= totalPages; i++) range.push(i);

  return (
    <div className="flex items-center justify-between mt-8 font-mono text-[12px]">
      <span className={dim}>
        {page} / {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link
            href={buildUrl(basePath, currentParams, paramName, page - 1)}
            className={`px-3 py-2 border ${border} ${active} no-underline ${hover}`}
          >
            ← PREV
          </Link>
        ) : (
          <span className={`px-3 py-2 border ${border} ${dim} opacity-30 cursor-not-allowed`}>
            ← PREV
          </span>
        )}
        {range.map((p) => (
          <Link
            key={p}
            href={buildUrl(basePath, currentParams, paramName, p)}
            className={`w-9 py-2 text-center border ${border} no-underline ${
              p === page ? `${active} ${activeBg}` : `${dim} ${hover}`
            }`}
          >
            {p}
          </Link>
        ))}
        {page < totalPages ? (
          <Link
            href={buildUrl(basePath, currentParams, paramName, page + 1)}
            className={`px-3 py-2 border ${border} ${active} no-underline ${hover}`}
          >
            NEXT →
          </Link>
        ) : (
          <span className={`px-3 py-2 border ${border} ${dim} opacity-30 cursor-not-allowed`}>
            NEXT →
          </span>
        )}
      </div>
    </div>
  );
}
