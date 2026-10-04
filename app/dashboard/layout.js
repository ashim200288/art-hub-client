"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, dashboardPath } from "@/components/AuthProvider";
import { Spinner } from "@/components/ui";
import { dashLinks } from "@/lib/nav";

const need = (p) => (p.startsWith("/dashboard/admin") ? "admin" : p.startsWith("/dashboard/artist") || p.startsWith("/dashboard/artwork") ? "artist" : p.startsWith("/dashboard/user") ? "user" : null);

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const required = need(path);

  useEffect(() => {
    if (loading) return; // wait for the token check so a reload never bounces to /login
    if (!user) router.replace(`/login?next=${path}`);
    else if (required && user.role !== required) router.replace(dashboardPath(user.role));
  }, [loading, user, path]);

  if (loading || !user || (required && user.role !== required)) return <Spinner full />;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:flex gap-6">
      <aside className="md:w-56 shrink-0 mb-6 md:mb-0">
        <div className="card p-4 md:sticky md:top-24">
          <div className="flex items-center gap-3 mb-4">
            {user.avatar ? <img src={user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="h-11 w-11 rounded-full bg-brand text-brand-ink grid place-items-center font-bold">{user.name[0]}</span>}
            <div className="min-w-0"><p className="font-semibold truncate">{user.name}</p><p className="text-xs text-muted capitalize">{user.role}</p></div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {dashLinks[user.role].map(([l, h]) => (
              <Link key={h} href={h} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold ${path === h ? "bg-brand-soft text-brand" : "text-muted hover:text-ink"}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </aside>
      <section className="flex-1 min-w-0">{children}</section>
    </div>
  );
}
