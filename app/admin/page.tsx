"use client";

import { AdminConsole } from "@/components/admin-console";

/**
 * masjidone.co.uk/admin/ — the live support console.
 *
 * THE ONE PAGE IN THIS REPOSITORY THAT TOUCHES THE REAL PLATFORM. Everything
 * else is marketing copy or a demonstration built from fixtures. There is no
 * demonstration strip here on purpose: a strip saying "sample data" above real
 * masajid would be worse than no strip at all.
 *
 * Still a static export. The console is JavaScript that runs in the browser
 * and talks to Supabase directly — no server, no API route, nothing for
 * output: 'export' to trip over.
 */
export default function AdminPage() {
  return (
    <div className="dshell">
      <AdminConsole />
    </div>
  );
}
