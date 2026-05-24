/**
 * Hero editor — `hero_section` is a single-row table, so this is a simple form.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Hero {
  id?: string;
  headline: string;
  tagline: string;
  cities_list: string[];
  gradient_word: string;
}

const EMPTY: Hero = {
  headline: "Create.",
  tagline: "Your one stop business solution.",
  cities_list: ["DUBAI", "LAHORE", "LONDON", "NEW YORK"],
  gradient_word: "Create.",
};

export default function HeroEditor() {
  const [hero, setHero] = useState<Hero>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("hero_section")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) setHero(data as Hero);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      headline: hero.headline,
      tagline: hero.tagline,
      cities_list: hero.cities_list,
      gradient_word: hero.gradient_word,
      updated_at: new Date().toISOString(),
    };

    const { error } = hero.id
      ? await supabase.from("hero_section").update(payload).eq("id", hero.id)
      : await supabase.from("hero_section").insert([payload]);

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSavedAt(new Date());
    }
  };

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-1">Hero section</h1>
      <p className="text-white/60 text-sm mb-6">
        The big text and city list shown on the home page hero.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
        <Field
          label="Headline (gradient word)"
          value={hero.gradient_word}
          onChange={(v) => setHero({ ...hero, gradient_word: v })}
          hint="The first word in the hero, animated with a gradient."
        />
        <Field
          label="Tagline (right side)"
          value={hero.tagline}
          onChange={(v) => setHero({ ...hero, tagline: v })}
        />
        <div>
          <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
            Cities (comma-separated)
          </label>
          <input
            type="text"
            value={hero.cities_list.join(", ")}
            onChange={(e) =>
              setHero({
                ...hero,
                cities_list: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
            placeholder="DUBAI, LAHORE, LONDON, NEW YORK"
          />
          <div className="text-white/40 text-xs mt-1">
            Currently: {hero.cities_list.length} cities
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {savedAt && (
            <span className="text-emerald-300 text-xs">
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 transition-colors"
      />
      {hint && <div className="text-white/40 text-xs mt-1">{hint}</div>}
    </div>
  );
}
