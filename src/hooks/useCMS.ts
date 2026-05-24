/**
 * useCMS — generic hook to fetch any Supabase table.
 *
 * Replaces hardcoded arrays in components. If the table is empty
 * or Supabase is unreachable, you can pass `fallback` so the site
 * still renders the original hardcoded content. This means the site
 * never breaks during the migration from hardcoded → CMS-driven.
 *
 * Examples:
 *   const { data: stats } = useCMS<Stat>("company_stats", {
 *     orderBy: "sort_order",
 *     fallback: HARDCODED_STATS,
 *   });
 *
 *   const { data: faqs } = useCMS<Faq>("faqs", {
 *     filter: { page: "home", is_active: true },
 *     orderBy: "sort_order",
 *   });
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface UseCMSOptions<T> {
  /** Equality filters: { is_active: true, page: "home" } */
  filter?: Record<string, unknown>;
  /** Column name to order by */
  orderBy?: string;
  /** Sort direction (default: ascending) */
  ascending?: boolean;
  /** Maximum rows to return */
  limit?: number;
  /** Used when Supabase returns nothing or errors — keeps site working */
  fallback?: T[];
}

export function useCMS<T>(
  table: string,
  options: UseCMSOptions<T> = {}
): { data: T[]; loading: boolean; error: string | null } {
  const fallback = options.fallback ?? [];
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable key for re-fetching when options change
  const optionsKey = JSON.stringify({
    filter: options.filter,
    orderBy: options.orderBy,
    ascending: options.ascending,
    limit: options.limit,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        let query = supabase.from(table).select("*");

        if (options.filter) {
          for (const [key, val] of Object.entries(options.filter)) {
            query = query.eq(key, val as never);
          }
        }

        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending ?? true,
          });
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: rows, error: err } = await query;

        if (cancelled) return;

        if (err) {
          // eslint-disable-next-line no-console
          console.warn(`[useCMS:${table}] Supabase error — using fallback:`, err.message);
          setError(err.message);
          setData(fallback);
        } else if (!rows || rows.length === 0) {
          // Empty table → use fallback so site doesn't render blank
          setData(fallback);
        } else {
          setData(rows as T[]);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`[useCMS:${table}] Network error — using fallback:`, e);
        if (!cancelled) {
          setData(fallback);
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, optionsKey]);

  return { data, loading, error };
}

/**
 * useCMSSingle — fetch a single-row table (e.g. hero_section).
 */
export function useCMSSingle<T>(
  table: string,
  fallback?: T | null
): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(fallback ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from(table)
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (cancelled) return;
        if (error || !row) {
          setData(fallback ?? null);
        } else {
          setData(row as T);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { data, loading };
}
