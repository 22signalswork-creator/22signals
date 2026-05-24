/**
 * usePageContent — fetches all rows from `page_content` once,
 * and exposes a `t(key, fallback)` function for components.
 *
 * Why a single hook + lookup function instead of one fetch per
 * key? It batches all text into one network request and keeps
 * the per-component code dead simple.
 *
 * Usage:
 *   const { t } = usePageContent();
 *   <h1>{t("services_hero_title", "Architecting the Future…")}</h1>
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PageContentRow {
  key: string;
  value: string | null;
}

let cache: Map<string, string> | null = null;
let cachePromise: Promise<Map<string, string>> | null = null;

const fetchAll = async (): Promise<Map<string, string>> => {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = supabase
    .from("page_content")
    .select("key,value")
    .then(({ data, error }) => {
      const map = new Map<string, string>();
      if (!error && data) {
        for (const row of data as PageContentRow[]) {
          if (row.value != null) map.set(row.key, row.value);
        }
      }
      cache = map;
      cachePromise = null;
      return map;
    });

  return cachePromise;
};

/** Clear the cache — call this from admin after saving edits. */
export function invalidatePageContent() {
  cache = null;
  cachePromise = null;
}

export function usePageContent() {
  const [map, setMap] = useState<Map<string, string>>(cache ?? new Map());

  useEffect(() => {
    let cancelled = false;
    fetchAll().then((m) => {
      if (!cancelled) setMap(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Look up a key. Returns the fallback if not in DB or value is empty. */
  const t = (key: string, fallback: string = ""): string => {
    const v = map.get(key);
    return v && v.length > 0 ? v : fallback;
  };

  return { t };
}
