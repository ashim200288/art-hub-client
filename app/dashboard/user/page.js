"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, money, date } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { RowSkeleton, Table, Empty } from "@/components/ui";
import ArtCard from "@/components/ArtCard";

const TIERS = [
  { id: "free", name: "Free", price: "$0", limit: "3 paintings" },
  { id: "pro", name: "Pro", price: "$9.99", limit: "9 paintings" },
  { id: "premium", name: "Premium", price: "$19.99", limit: "Unlimited" },
];

export default function UserDash() {
  const { user } = useAuth();
  const [tx, setTx] = useState(null);
  const [bought, setBought] = useState(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    api("/transactions/mine").then(setTx).catch(() => { setTx([]); toast.error("Failed to load purchases"); });
    api("/artworks/bought").then(setBought).catch(() => setBought([]));
  }, []);

  const upgrade = async (tier) => {
    setBusy(tier);
    try { window.location.href = (await api("/payments/subscription", { method: "POST", body: { tier } })).url; }
    catch (e) { toast.error(e.message); setBusy(""); }
  };
  const purchases = tx?.filter((t) => t.type === "purchase");

  return (
    <div className="space-y-10">
      <div><h1 className="text-3xl font-bold">Your collection</h1><p className="text-muted">{purchases ? `${purchases.length} artworks bought` : " "}</p></div>

      <section>
        <h2 className="text-xl font-bold mb-3">Subscription</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => {
            const current = user.subscriptionTier === t.id;
            return (
              <div key={t.id} className={`card p-5 ${current ? "border-brand ring-2 ring-brand/30" : ""}`}>
                <p className="font-display text-xl font-bold">{t.name}</p>
                <p className="text-3xl font-extrabold mt-1">{t.price}</p>
                <p className="text-sm text-muted mt-1">{t.limit}</p>
                {current ? <p className="mt-4 text-sm font-semibold text-brand">Current plan</p>
                  : t.id === "free" ? <p className="mt-4 text-sm text-muted">Default plan</p>
                  : <button className="btn btn-primary mt-4 w-full" disabled={busy === t.id || user.subscriptionTier === "premium"} onClick={() => upgrade(t.id)}>{busy === t.id ? "Redirecting…" : `Upgrade to ${t.name}`}</button>}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Purchase history</h2>
        {tx === null ? <RowSkeleton /> : tx.length === 0 ? <Empty title="No purchases yet" hint="Find something you love."><Link href="/artworks" className="btn btn-primary">Browse artworks</Link></Empty> : (
          <Table head={["Item", "Artist", "Price", "Date"]}>
            {tx.map((t) => (
              <tr key={t._id}>
                <td>{t.type === "purchase" ? <Link href={`/artworks/${t.artwork?._id}`} className="font-semibold hover:text-brand">{t.artwork?.title || "Removed artwork"}</Link> : <span className="capitalize">{t.tier} plan</span>}</td>
                <td>{t.artist?.name || "ArtHub"}</td><td>{money(t.amount)}</td><td>{date(t.createdAt)}</td>
              </tr>
            ))}
          </Table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Bought artworks</h2>
        {bought === null ? <RowSkeleton rows={2} /> : bought.length === 0 ? <p className="text-muted">Artworks you buy will show up here.</p> : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{bought.map((a) => <ArtCard key={a._id} art={a} />)}</div>
        )}
      </section>
    </div>
  );
}
