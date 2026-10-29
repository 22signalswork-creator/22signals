// Newsletter sign-ups.
//
// Until the newsletter backend exists, sign-ups are saved into the
// `contact_submissions` table with service = "Newsletter sign-up", so they
// show up in /admin > Contact submissions straight away. When the newsletter
// backend is built, export rows with that service value.
import { supabase } from "@/lib/supabase";

export const NEWSLETTER_SERVICE = "Newsletter sign-up";

export async function subscribe(email: string, source: string): Promise<{ ok: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(clean)) return { ok: false, error: "Please enter a valid email address." };
  const { error } = await supabase.from("contact_submissions").insert([
    {
      name: null,
      email: clean,
      company: null,
      country: null,
      service: NEWSLETTER_SERVICE,
      budget: null,
      timeline: null,
      message: `Subscribed from: ${source}`,
    },
  ]);
  if (error) {
    console.error("[Newsletter] insert failed:", error);
    return { ok: false, error: "That didn't go through. Please try again." };
  }
  return { ok: true };
}
