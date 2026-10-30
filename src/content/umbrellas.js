// The seven service umbrellas. Used by the header menu, the homepage globe and
// the /services tabs. `items` link to real service pages only.
export const UMBRELLAS = [
  {
    slug: "strategy",
    name: "Strategy and Consulting",
    short: "Strategy",
    items: [
      { label: "Go-to-Market Strategy", path: "/services/go-to-market" },
      { label: "AI Consulting", path: "/services/ai-consulting" },
      { label: "Business Optimization", path: "/services/business-optimization" },
    ],
  },
  {
    slug: "ai",
    name: "AI and Automation",
    short: "AI and Automation",
    items: [
      { label: "AI Automation", path: "/services/ai-automation" },
      { label: "Custom AI Development", path: "/services/custom-ai-development" },
      { label: "WhatsApp Automation", path: "/services/whatsapp-automation" },
    ],
  },
  {
    slug: "data-cloud",
    name: "Data and Cloud",
    short: "Data and Cloud",
    items: [
      { label: "Business Intelligence", path: "/services/business-intelligence" },
      { label: "Power BI Consulting", path: "/services/power-bi-consulting" },
      { label: "Data Engineering", path: "/services/data-engineering" },
      { label: "Cloud Consulting", path: "/services/cloud" },
      { label: "Cloud Migration", path: "/services/cloud-migration" },
      { label: "DevOps Consulting", path: "/services/devops-consulting" },
    ],
  },
  {
    slug: "web-apps",
    name: "Web and App Development",
    short: "Web and Apps",
    items: [
      { label: "Web Development", path: "/services/web-app-development" },
      { label: "App Development", path: "/services/app-development" },
    ],
  },
  {
    slug: "growth",
    name: "Growth Marketing",
    short: "Growth Marketing",
    items: [
      { label: "SEO and GEO", path: "/services/seo-geo" },
      { label: "Paid Media", path: "/services/paid-media" },
      { label: "Social Media Management", path: "/services/social-media-management" },
      { label: "Influencer Campaigns", path: "/services/influencer-campaigns" },
      { label: "Content Marketing", path: "/services/content-marketing" },
    ],
  },
  {
    slug: "creative",
    name: "Creative Studio",
    short: "Creative Studio",
    items: [
      { label: "Video and Motion Graphics", path: "/services/video-motion" },
      { label: "AI Video Production", path: "/services/ai-video-production" },
      { label: "2D and 3D Animation", path: "/services/3d-animation" },
      { label: "3D Rendering", path: "/services/3d-rendering" },
    ],
  },
  {
    slug: "managed",
    name: "Managed Services and Events",
    short: "Managed Services",
    items: [
      { label: "Managed Teams", path: "/services/more" },
      { label: "Live Events and Broadcast", path: "/services/more" },
      { label: "Game Development", path: "/services/more" },
      { label: "Product Sourcing", path: "/services/more" },
    ],
  },
];

export const umbrellaFor = (path) => UMBRELLAS.find((u) => u.items.some((i) => i.path === path));
export const NEW_SERVICES = new Set(["/services/social-media-management", "/services/influencer-campaigns", "/services/content-marketing"]);
