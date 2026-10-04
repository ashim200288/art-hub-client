"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, money } from "@/lib/api";
import { RowSkeleton, Table, Empty } from "@/components/ui";

export default function ArtistDash() {
  const [list, setList] = useState(null);
  useEffect(() => { api("/artworks/mine").then(setList).catch(() => { setList([]); toast.error("Failed to load artworks"); }); }, []);
  const del = async (a) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try { await api(`/artworks/${a._id}`, { method: "DELETE" }); setList(list.filter((x) => x._id !== a._id)); toast.success("Artwork deleted"); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Your artworks</h1><Link href="/dashboard/artwork/new" className="btn btn-primary">Add artwork</Link></div>
      {list === null ? <RowSkeleton /> : list.length === 0 ? <Empty title="You haven't added any artwork" hint="Upload your first piece to start selling." /> : (
        <Table head={["Artwork", "Price", "Status", "Actions"]}>
          {list.map((a) => (
            <tr key={a._id}>
              <td><Link href={`/artworks/${a._id}`} className="flex items-center gap-3 font-semibold hover:text-brand"><img src={a.image} alt="" className="h-10 w-10 rounded object-cover" />{a.title}</Link></td>
              <td>{money(a.price)}</td><td>{a.sold ? "Sold" : "Available"}</td>
              <td className="space-x-3 whitespace-nowrap"><Link href={`/dashboard/artwork/${a._id}/edit`} className="text-brand font-semibold">Edit</Link><button onClick={() => del(a)} className="text-hot font-semibold">Delete</button></td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
