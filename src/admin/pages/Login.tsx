/**
 * Admin login page — email + password via Supabase Auth.
 */
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in → bounce straight into the dashboard
  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.3em] uppercase border border-blue-500/40 text-blue-300 mb-4">
            22 Signals
          </div>
          <h1 className="text-2xl text-white font-medium">Admin Sign-In</h1>
          <p className="text-white/50 text-sm mt-2">
            Enter the email and password for your CMS admin account.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 transition-colors"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-white/40 text-xs text-center mt-2">
            Forgot password? Reset it from the Supabase dashboard.
          </p>
        </form>
      </div>
    </div>
  );
}
