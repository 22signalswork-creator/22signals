/**
 * Config-driven admin pages — each is a `CrudPage` configured for one table.
 * Add a new page by adding a new config and exporting a wrapper component.
 */
import CrudPage, { type CrudConfig } from "../components/CrudPage";

// ------------------------------------------------------------
// SERVICES
// ------------------------------------------------------------
const servicesConfig: CrudConfig = {
  table: "services",
  title: "Services",
  description: "The 7 service cards on the home and services pages.",
  defaultSort: "sort_order",
  fields: [
    { name: "title", label: "Title", type: "text", required: true, preview: true },
    { name: "description", label: "Description", type: "textarea", rows: 3, preview: true },
    {
      name: "icon_url",
      label: "Icon",
      type: "image",
      folder: "services",
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      options: ["dark", "blue", "light"],
      defaultValue: "dark",
    },
    {
      name: "size",
      label: "Card size",
      type: "select",
      options: ["normal", "tall", "wide"],
      defaultValue: "normal",
    },
    { name: "pillar_number", label: "Pillar number", type: "number" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
};
export const ServicesAdmin = () => <CrudPage config={servicesConfig} />;

// ------------------------------------------------------------
// COMPANY STATS
// ------------------------------------------------------------
const statsConfig: CrudConfig = {
  table: "company_stats",
  title: "Company stats",
  description:
    "Animated rolling numbers used on the home, services and portfolio pages.",
  defaultSort: "sort_order",
  fields: [
    {
      name: "prefix",
      label: "Prefix (before number)",
      type: "text",
      placeholder: "$ (leave blank for none)",
      preview: true,
    },
    { name: "value", label: "Value", type: "number", required: true, preview: true },
    {
      name: "suffix",
      label: "Suffix (after number)",
      type: "text",
      placeholder: "+ or % or M",
      defaultValue: "+",
      preview: true,
    },
    { name: "label", label: "Label", type: "text", required: true, preview: true },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
};
export const StatsAdmin = () => <CrudPage config={statsConfig} />;

// ------------------------------------------------------------
// PROCESS STEPS
// ------------------------------------------------------------
const processStepsConfig: CrudConfig = {
  table: "process_steps",
  title: "Process steps",
  description: "The 4-step Operational Framework section.",
  defaultSort: "sort_order",
  fields: [
    {
      name: "step_number",
      label: "Step number",
      type: "text",
      required: true,
      placeholder: "01, 02, 03…",
      preview: true,
    },
    { name: "title", label: "Title", type: "text", required: true, preview: true },
    { name: "description", label: "Description", type: "textarea", rows: 2 },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
};
export const ProcessStepsAdmin = () => <CrudPage config={processStepsConfig} />;

// ------------------------------------------------------------
// FAQS
// ------------------------------------------------------------
const faqsConfig: CrudConfig = {
  table: "faqs",
  title: "FAQs",
  description:
    "Use the 'page' field to control where each FAQ appears: home, services, or portfolio.",
  defaultSort: "sort_order",
  fields: [
    { name: "question", label: "Question", type: "text", required: true, preview: true },
    { name: "answer", label: "Answer", type: "textarea", rows: 5 },
    {
      name: "page",
      label: "Page",
      type: "select",
      options: ["home", "services", "portfolio"],
      defaultValue: "home",
      preview: true,
    },
    { name: "sort_order", label: "Sort order", type: "number" },
    {
      name: "is_active",
      label: "Active (visible on site)",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
export const FaqsAdmin = () => <CrudPage config={faqsConfig} />;

// ------------------------------------------------------------
// PROJECTS
// ------------------------------------------------------------
const projectsConfig: CrudConfig = {
  table: "projects",
  title: "Projects",
  description:
    "Featured projects shown on the home page (mark them as featured).",
  defaultSort: "sort_order",
  fields: [
    { name: "title", label: "Title", type: "text", required: true, preview: true },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    {
      name: "image_url",
      label: "Project image",
      type: "image",
      folder: "projects",
      preview: true,
    },
    { name: "category", label: "Category", type: "text" },
    {
      name: "is_featured",
      label: "Featured (shown on home page)",
      type: "boolean",
      defaultValue: false,
      preview: true,
    },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
};
export const ProjectsAdmin = () => <CrudPage config={projectsConfig} />;

// ------------------------------------------------------------
// TESTIMONIALS
// ------------------------------------------------------------
const testimonialsConfig: CrudConfig = {
  table: "testimonials",
  title: "Testimonials",
  defaultSort: "sort_order",
  fields: [
    {
      name: "image_url",
      label: "Photo",
      type: "image",
      folder: "testimonials",
      preview: true,
    },
    { name: "name", label: "Name", type: "text", required: true, preview: true },
    { name: "role", label: "Role / Company", type: "text", preview: true },
    { name: "text", label: "Quote", type: "textarea", rows: 4 },
    { name: "sort_order", label: "Sort order", type: "number" },
    {
      name: "is_active",
      label: "Active (shown in carousel)",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
export const TestimonialsAdmin = () => <CrudPage config={testimonialsConfig} />;

// ------------------------------------------------------------
// BLOG POSTS
// ------------------------------------------------------------
const blogPostsConfig: CrudConfig = {
  table: "blog_posts",
  title: "Blog posts",
  defaultSort: "published_at",
  defaultSortAscending: false,
  fields: [
    {
      name: "image_url",
      label: "Cover image",
      type: "image",
      folder: "blog",
      preview: true,
    },
    { name: "title", label: "Title", type: "text", required: true, preview: true },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "category", label: "Category", type: "text", preview: true },
    { name: "author", label: "Author", type: "text" },
    { name: "read_time", label: "Read time (min)", type: "number", defaultValue: 6 },
    { name: "published_at", label: "Published date", type: "date" },
    {
      name: "is_published",
      label: "Published (visible on site)",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
export const BlogPostsAdmin = () => <CrudPage config={blogPostsConfig} />;

// ------------------------------------------------------------
// TEAM MEMBERS
// ------------------------------------------------------------
const teamMembersConfig: CrudConfig = {
  table: "team_members",
  title: "Team members",
  defaultSort: "sort_order",
  fields: [
    {
      name: "image_url",
      label: "Photo",
      type: "image",
      folder: "team",
      preview: true,
    },
    { name: "name", label: "Name", type: "text", required: true, preview: true },
    { name: "role", label: "Role", type: "text", preview: true },
    { name: "bio", label: "Bio", type: "textarea", rows: 4 },
    { name: "sort_order", label: "Sort order", type: "number" },
    {
      name: "is_active",
      label: "Active (shown on team page)",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
export const TeamMembersAdmin = () => <CrudPage config={teamMembersConfig} />;

// ------------------------------------------------------------
// CLIENT LOGOS
// ------------------------------------------------------------
const clientLogosConfig: CrudConfig = {
  table: "client_logos",
  title: "Client logos",
  description: "Logos shown in the home page client slider.",
  defaultSort: "sort_order",
  fields: [
    {
      name: "logo_url",
      label: "Logo image",
      type: "image",
      folder: "logos",
      preview: true,
    },
    { name: "name", label: "Client name", type: "text", preview: true },
    { name: "sort_order", label: "Sort order", type: "number" },
    {
      name: "is_active",
      label: "Active (shown in slider)",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
export const ClientLogosAdmin = () => <CrudPage config={clientLogosConfig} />;
