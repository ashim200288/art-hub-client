"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, money, date } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Sk } from "@/components/ui";
import Comments from "@/components/Comments";

export default function Details() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [art, setArt] = useState(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api(`/artworks/${id}`).then(setArt).catch(() => setMissing(true)); }, [id]);

  if (missing)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Artwork not found</h1>
        <p className="text-muted mt-2">It may have been removed by the artist.</p>
        <Link href="/artworks" className="btn btn-primary mt-6">Browse artworks</Link>
      </div>
    );
  if (!art)
    return <div className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-2 gap-8"><Sk className="aspect-[4/5]" /><div className="space-y-4"><Sk className="h-10" /><Sk className="h-6 w-1/2" /><Sk className="h-32" /></div></div>;

  const isOwner = user && user.id === art.artist?._id;
  const buy = async () => {
    if (!user) { router.push(`/login?next=/artworks/${id}`); return; }
    setBusy(true);
    try { window.location.href = (await api("/payments/artwork", { method: "POST", body: { artworkId: id } })).url; }
    catch (e) {
      toast.error(e.message);
      if (e.code === "LIMIT") router.push("/dashboard/user");
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!confirm("Delete this artwork permanently?")) return;
    try { await api(`/artworks/${id}`, { method: "DELETE" }); toast.success("Artwork deleted"); router.push("/dashboard/artist"); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative card overflow-hidden">
          <img src={art.image} alt={art.title} className="w-full object-cover" />
          {art.sold && <span className="absolute top-3 left-3 rounded-md bg-hot px-3 py-1 text-sm font-bold text-white">Sold</span>}
        </div>
        <div>
          <p className="text-sm font-semibold text-brand">{art.category}</p>
          <h1 className="text-4xl font-bold mt-1">{art.title}</h1>
          <p className="mt-2 text-muted">by <Link href={`/artworks?artist=${art.artist?._id}`} className="font-semibold text-ink underline decoration-brand underline-offset-4">{art.artist?.name}</Link></p>
          <p className="mt-6 text-4xl font-display font-extrabold">{money(art.price)}</p>
          <p className="mt-6 leading-relaxed whitespace-pre-line">{art.description}</p>
          <p className="mt-4 text-sm text-muted">Uploaded {date(art.createdAt)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary !px-8 !py-3" onClick={buy} disabled={busy || isOwner || art.sold}>
              {art.sold ? "Sold" : isOwner ? "This is your artwork" : busy ? "Redirecting to Stripe…" : "Buy now"}
            </button>
            {isOwner && (
              <>
                <Link href={`/dashboard/artwork/${id}/edit`} className="btn btn-ghost">Edit</Link>
                <button onClick={remove} className="btn btn-danger">Delete</button>
              </>
            )}
          </div>
          {!user && <p className="mt-3 text-sm text-muted">You'll need to <Link href={`/login?next=/artworks/${id}`} className="text-brand font-semibold">log in</Link> to buy.</p>}
        </div>
      </div>
      <Comments artworkId={id} />
    </div>
  );
}
