/**
 * AdminLayout — sidebar + header shell for all /admin/* pages.
 */
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface NavGroup {
  label: string;
  items: { to: string; label: string }[];
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard" }],
  },
  {
    label: "Page text",
    items: [{ to: "/admin/page-content", label: "All page text" }],
  },
  {
    label: "Home page",
    items: [
      { to: "/admin/hero", label: "Hero" },
      { to: "/admin/stats", label: "Stats" },
      { to: "/admin/services", label: "Service cards" },
      { to: "/admin/process-steps", label: "Process steps" },
      { to: "/admin/testimonials", label: "Testimonials" },
      { to: "/admin/projects", label: "Featured projects" },
    ],
  },
  {
    label: "Services page",
    items: [
      { to: "/admin/service-pillars", label: "Service pillars (overview cards)" },
      { to: "/admin/service-detail-pages", label: "Service detail pages" },
    ],
  },
  {
  label: "Portfolio",
  items: [
    { to: "/admin/project-detail-pages", label: "Project detail pages" },
  ],
},
  {
    label: "R&D",
    items: [
      { to: "/admin/rd-research-pages", label: "R&D research pages" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/faqs", label: "FAQs" },
      { to: "/admin/blog-posts", label: "Blog posts" },
      { to: "/admin/team-members", label: "Team" },
      { to: "/admin/client-logos", label: "Client logos" },
    ],
  },
  {
    label: "Settings & inbox",
    items: [
      { to: "/admin/site-settings", label: "Site settings" },
      { to: "/admin/email-settings", label: "Email / SMTP" },
      { to: "/admin/contact-submissions", label: "Contact submissions" },
    ],
  },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0b0c10] flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-blue-300">
            22 Signals
          </div>
          <div className="text-base font-medium mt-0.5">CMS Admin</div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV.map((group) => (
            <div key={group.label}>
              <div className="px-2 text-[10px] tracking-[0.25em] uppercase text-white/35 mb-2">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/admin"}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-blue-500/15 text-blue-100 border border-blue-500/30"
                            : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-white/50 truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full mt-1 rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] text-left transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
          <div className="text-sm text-white/70">
            Editing live content — changes appear on the public site after refresh.
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/[0.05] transition-colors"
          >
            View live site ↗
          </a>
        </header>
        <div className="p-6 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
