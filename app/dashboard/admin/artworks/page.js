"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, money } from "@/lib/api";
import { RowSkeleton, Table } from "@/components/ui";

export default function AllArtworks() {
  const [list, setList] = useState(null);
  useEffect(() => { api("/artworks?limit=24").then(async (first) => {
    let all = first.items;
    for (let p = 2; p <= first.pages; p++) all = all.concat((await api(`/artworks?limit=24&page=${p}`)).items);
    setList(all);
  }).catch(() => { setList([]); toast.error("Failed to load artworks"); }); }, []);
  const del = async (a) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try { await api(`/artworks/${a._id}`, { method: "DELETE" }); setList(list.filter((x) => x._id !== a._id)); toast.success("Artwork deleted"); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All artworks</h1>
      {list === null ? <RowSkeleton /> : (
        <Table head={["Title", "Artist", "Price", "Actions"]}>
          {list.map((a) => <tr key={a._id}><td><Link href={`/artworks/${a._id}`} className="font-semibold hover:text-brand">{a.title}</Link></td><td>{a.artist?.name}</td><td>{money(a.price)}</td>
            <td><button onClick={() => del(a)} className="text-hot font-semibold">Delete</button></td></tr>)}
        </Table>
      )}
    </div>
  );
}
