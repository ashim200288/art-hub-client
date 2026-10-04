"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ArtCard from "@/components/ArtCard";
import { CardSkeleton, Empty } from "@/components/ui";
import { api, CATEGORIES } from "@/lib/api";

function Browse() {
  const sp = useSearchParams();
  const [f, setF] = useState({ search: "", category: sp.get("category") || "", minPrice: "", maxPrice: "", sort: "newest", artist: sp.get("artist") || "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [term, setTerm] = useState("");

  useEffect(() => { const t = setTimeout(() => { setF((x) => ({ ...x, search: term })); setPage(1); }, 350); return () => clearTimeout(t); }, [term]);

  useEffect(() => {
    setData(null);
    const q = new URLSearchParams({ ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)), page, limit: 8 });
    api(`/artworks?${q}`).then(setData).catch(() => { toast.error("Failed to load artworks"); setData({ items: [], pages: 1, total: 0 }); });
  }, [f, page]);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setPage(1); };
  const reset = () => { setTerm(""); setF({ search: "", category: "", minPrice: "", maxPrice: "", sort: "newest", artist: "" }); setPage(1); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold">Browse artworks</h1>
      <div className="card p-4 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <input className="input lg:col-span-2" placeholder="Search by title or artist" value={term} onChange={(e) => setTerm(e.target.value)} aria-label="Search" />
        <select className="input" value={f.category} onChange={set("category")} aria-label="Category">
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="input" type="number" min="0" placeholder="Min $" value={f.minPrice} onChange={set("minPrice")} aria-label="Minimum price" />
        <input className="input" type="number" min="0" placeholder="Max $" value={f.maxPrice} onChange={set("maxPrice")} aria-label="Maximum price" />
        <select className="input" value={f.sort} onChange={set("sort")} aria-label="Sort">
          <option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data === null ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />) : data.items.map((a) => <ArtCard key={a._id} art={a} />)}
      </div>
      {data?.items.length === 0 && <div className="mt-6"><Empty title="No artworks match your filters" hint="Try a different search or widen the price range."><button onClick={reset} className="btn btn-ghost">Clear filters</button></Empty></div>}

      {data && data.pages > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          {Array.from({ length: data.pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1} className={`btn !px-3 ${page === i + 1 ? "btn-primary" : "btn-ghost"}`}>{i + 1}</button>
          ))}
          <button className="btn btn-ghost" disabled={page === data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      )}
    </div>
  );
}
export default function Page() { return <Suspense><Browse /></Suspense>; }
