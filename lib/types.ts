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
  link?: string;
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

export type GraphicDetail = {
  desc?: string;
  link?: string;
  linkLabel?: string;
  imageNote?: string;
  cover?: string;
  gallery?: { id: string; cap: string; url?: string }[];
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

export type PortfolioData = {
  profile: Profile;
  stats: Stats;
  tools: string[];
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
  };
};
