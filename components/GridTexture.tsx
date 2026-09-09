export default function GridTexture({ light = false }: { light?: boolean }) {
  return <div aria-hidden className={`grid-texture${light ? " grid-texture--light" : ""}`} />;
}
