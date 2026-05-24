/**
 * Admin Dashboard — quick overview of CMS contents and recent submissions.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Counts {
  services: number;
  projects: number;
  testimonials: number;
  faqs: number;
  blog_posts: number;
  contact_submissions: number;
}

const TILES: { key: keyof Counts; label: string; to: string }[] = [
  { key: "services", label: "Services", to: "/admin/services" },
  { key: "projects", label: "Projects", to: "/admin/projects" },
  { key: "testimonials", label: "Testimonials", to: "/admin/testimonials" },
  { key: "faqs", label: "FAQs", to: "/admin/faqs" },
  { key: "blog_posts", label: "Blog posts", to: "/admin/blog-posts" },
  {
    key: "contact_submissions",
    label: "Contact submissions",
    to: "/admin/contact-submissions",
  },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({
    services: 0,
    projects: 0,
    testimonials: 0,
    faqs: 0,
    blog_posts: 0,
    contact_submissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tables = Object.keys(counts) as (keyof Counts)[];
    Promise.all(
      tables.map((t) =>
        supabase
          .from(t)
          .select("*", { count: "exact", head: true })
          .then((r) => [t, r.count ?? 0] as const)
      )
    ).then((entries) => {
      const next = { ...counts };
      for (const [k, n] of entries) (next as any)[k] = n;
      setCounts(next);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Dashboard</h1>
      <p className="text-white/60 text-sm mb-8">
        Manage all your website content from here. Pick a section from the
        sidebar to start editing.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TILES.map((tile) => (
          <Link
            key={tile.key}
            to={tile.to}
            className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 p-5 transition-colors"
          >
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">
              {tile.label}
            </div>
            <div className="text-3xl font-medium">
              {loading ? "—" : counts[tile.key]}
            </div>
            <div className="text-white/40 text-xs mt-2">View &amp; edit →</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="text-sm font-medium mb-3">Quick tips</div>
        <ul className="text-sm text-white/65 space-y-2 list-disc pl-5">
          <li>
            Edits show on the public site after a refresh — open it in another
            tab to compare.
          </li>
          <li>
            Image fields upload to Supabase Storage automatically. Replace any
            time without breaking links.
          </li>
          <li>
            FAQs use a <em>page</em> field — set <code>home</code>,{" "}
            <code>services</code>, or <code>portfolio</code> to control where
            they appear.
          </li>
        </ul>
      </div>
    </div>
  );
}
