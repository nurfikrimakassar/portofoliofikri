export type Block = {
  id: string;
  type: "para" | "heading" | "quote" | "image";
  text?: string;
  cap?: string;
  url?: string;
};

export type MetaPair = { k: string; v: string };

export type Profile = {
  name: string;
  tagline: string;
  location: string;
  study: string;
  status: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  tiktok: string;
  tiktokUrl: string;
  roles: string[];
};

export type Stats = {
  roles: string;
  projects: string;
  automations: string;
  products: string;
};

export type Experience = {
  period: string;
  role: string;
  org: string;
  tag: string;
};

export type WebWork = {
  id: string;
  idx: string;
  title: string;
  cat: string;
  year: string;
  desc: string;
};

export type GraphicWork = {
  id: string;
  title: string;
  cat: string;
};

export type Product = {
  idx: string;
  title: string;
  price: string;
  desc: string;
  stat: string;
  tags: string[];
  image?: string;
  buyLink?: string;
  linkLabel?: string;
};

export type ProductDetail = {
  cover?: string;
  body?: Block[];
};

export type Automation = {
  id: string;
  idx: string;
  title: string;
  stack: string;
  problem: string;
  result: string;
};

export type BlogPost = {
  id: string;
  date: string;
  read: string;
  cat: string;
  title: string;
  excerpt?: string;
};

export type ProjectDetail = {
  link?: string;
  linkLabel?: string;
  cover?: string;
  meta?: MetaPair[];
  body?: Block[];
};

export type GalleryImage = { id: string; cap?: string; url?: string; href?: string };
export type GalleryRow = { id: string; images: GalleryImage[] }; // 1–4 images, all shown at the same height

/** One item in a graphic project's story: a paragraph, a heading, or a photo-row, freely reorderable. */
export type GraphicContentBlock =
  | { id: string; type: "text"; text?: string }
  | { id: string; type: "heading"; text?: string }
  | { id: string; type: "row"; images: GalleryImage[] };

export type GraphicDetail = {
  desc?: string;
  link?: string;
  linkLabel?: string;
  /** Card/thumbnail image only — not rendered inside the detail page itself. */
  cover?: string;
  meta?: MetaPair[];
  /** Ordered mix of paragraphs and photo-rows, reorderable up/down. */
  content?: GraphicContentBlock[];
  /** @deprecated migrated into `content` on first edit; kept so unedited older items still render */
  imageNote?: string;
  /** @deprecated migrated into `content` on first edit; kept so unedited older items still render */
  galleryRows?: GalleryRow[];
  /** @deprecated superseded by galleryRows/content */
  cols?: number;
  /** @deprecated superseded by galleryRows/content */
  gallery?: { id: string; cap: string; url?: string; href?: string }[];
};

export type CaseStudyDetail = {
  summary?: string;
  cover?: string;
  meta?: MetaPair[];
  results?: { num: string; label: string }[];
  body?: Block[];
};

export type BlogDetail = {
  cover?: string;
  body?: Block[];
};

export type LinkHubLink = { id: string; label: string; url: string };
export type LinkHubGroup = {
  id: string;
  /** URL segment — portofolio.nurfikri.com/<slug> */
  slug: string;
  title: string;
  /** Short one/two-sentence intro shown on both the index card and the group's own page. */
  intro?: string;
  /** e.g. "Part-time", "Internship", "Full-time" */
  type?: string;
  location?: string;
  links: LinkHubLink[];
};
/** The single-link hub served at portofolio.nurfikri.com. The root page lists
 * each employer/project as its own card (intro, type, location); each card's
 * "VISIT LINK" opens portofolio.nurfikri.com/<slug>, a dedicated page listing
 * just that group's links — so the whole thing is still one URL to hand out
 * (e.g. for an Apple Academy application) while staying organised per context. */
export type LinkHub = {
  headline: string;
  description: string;
  groups: LinkHubGroup[];
};

export type PortfolioData = {
  profile: Profile;
  stats: Stats;
  tools: string[];
  photoStrip: string[]; // scrolling photo ticker on the homepage, between Experience & Selected Work
  linkHub: LinkHub;
  experience: Experience[];
  webWorks: WebWork[];
  graphicWorks: GraphicWork[];
  products: Product[];
  automation: Automation[];
  blog: {
    featuredId: string;
    posts: BlogPost[];
  };
  detail: {
    project: Record<string, ProjectDetail>;
    graphic: Record<string, GraphicDetail>;
    cs: Record<string, CaseStudyDetail>;
    blog: Record<string, BlogDetail>;
    prod: Record<string, ProductDetail>;
  };
};
