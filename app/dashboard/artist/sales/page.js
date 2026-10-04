"use client";
import { useEffect, useState } from "react";
import { api, money, date } from "@/lib/api";
import { RowSkeleton, Table, Empty } from "@/components/ui";

export default function Sales() {
  const [list, setList] = useState(null);
  useEffect(() => { api("/transactions/sales").then(setList).catch(() => setList([])); }, []);
  const total = list?.reduce((s, t) => s + t.amount, 0) || 0;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Sales history</h1>{list && <p className="text-muted">{list.length} sales · {money(total)} earned</p>}</div>
      {list === null ? <RowSkeleton /> : list.length === 0 ? <Empty title="No sales yet" hint="Sales appear here as soon as a buyer pays." /> : (
        <Table head={["Artwork", "Buyer", "Date", "Amount"]}>
          {list.map((t) => <tr key={t._id}><td className="font-semibold">{t.artwork?.title || "Removed artwork"}</td><td>{t.user?.name}</td><td>{date(t.createdAt)}</td><td>{money(t.amount)}</td></tr>)}
        </Table>
      )}
    </div>
  );
}
