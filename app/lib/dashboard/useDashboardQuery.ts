"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/client";

/**
 * Fetches dashboard data directly from Supabase in the browser (no Next.js
 * server round-trip), so route navigation is instant and each page just
 * streams its own data in once the client mounts — mirroring a plain SPA.
 */
export function useDashboardQuery<T>(
  fetcher: (supabase: SupabaseClient, userId: string) => Promise<T>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server actions redirect back to the same route after mutating data,
  // changing only the `toast` query param. Without this, the effect below
  // never re-runs on that redirect (its own deps are unchanged) and the page
  // keeps showing pre-mutation data until some unrelated nav forces a remount.
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    (async () => {
      // getSession() reads the already-validated session from local storage
      // (no network call) — the proxy middleware already verified it with
      // Supabase's auth server before this protected route was ever served.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;

      if (cancelled) return;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const result = await fetcher(supabase, currentUser.id);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey, ...deps]);

  return { data, user, loading, error };
}
